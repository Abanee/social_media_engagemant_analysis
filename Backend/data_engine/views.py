from pathlib import Path

from django.core.files import File
from django.http import JsonResponse
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from .models import Dataset
from .serializers import DatasetSerializer
from .utils_cleaning import clean_dataset
from .utils_eda import generate_eda


ALLOWED_EXTENSIONS = {'.csv', '.xlsx', '.xls'}


def _get_dataset_or_error(dataset_id):
    try:
        dataset = Dataset.objects.get(id=dataset_id)
    except Dataset.DoesNotExist:
        return None, JsonResponse({'error': 'Dataset not found.'}, status=400)
    return dataset, None


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def upload_dataset(request):
    uploaded_file = request.FILES.get('file')
    if not uploaded_file:
        return JsonResponse({'error': 'No file provided.'}, status=400)

    extension = Path(uploaded_file.name).suffix.lower()
    if extension not in ALLOWED_EXTENSIONS:
        return JsonResponse({'error': 'Unsupported file type.'}, status=400)

    dataset = Dataset.objects.create(file=uploaded_file)
    serializer = DatasetSerializer(dataset)
    return JsonResponse({'message': 'File uploaded successfully.', 'dataset': serializer.data}, status=201)


@api_view(['POST'])
@parser_classes([JSONParser])
def preprocess_dataset(request, dataset_id):
    dataset, error_response = _get_dataset_or_error(dataset_id)
    if error_response:
        return error_response

    cleaned_path, summary = clean_dataset(dataset.file.path)
    with open(cleaned_path, 'rb') as cleaned_file:
        dataset.cleaned_file.save(Path(cleaned_path).name, File(cleaned_file), save=False)
    dataset.is_cleaned = True
    dataset.save()

    return JsonResponse({
        'message': 'Dataset cleaned successfully.',
        'summary': summary,
        'dataset_id': dataset.id,
        'cleaned_file': dataset.cleaned_file.url if dataset.cleaned_file else None,
    }, status=200)


@api_view(['GET'])
def eda_dataset(request, dataset_id):
    dataset, error_response = _get_dataset_or_error(dataset_id)
    if error_response:
        return error_response

    file_path = dataset.cleaned_file.path if dataset.is_cleaned and dataset.cleaned_file else dataset.file.path
    eda_payload = generate_eda(file_path)
    return JsonResponse({
        'message': 'EDA generated successfully.',
        'dataset_id': dataset.id,
        'eda': eda_payload,
    }, status=200)
