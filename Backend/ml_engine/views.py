from pathlib import Path

from django.core.files import File
from django.http import JsonResponse
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import JSONParser

from data_engine.models import Dataset
from .ml_manager import train_model, save_model, load_model, predict
from .models import TrainedModel
from .serializers import TrainedModelSerializer


def _get_dataset_or_error(dataset_id):
    try:
        dataset = Dataset.objects.get(id=dataset_id)
    except Dataset.DoesNotExist:
        return None, JsonResponse({'error': 'Dataset not found.'}, status=400)
    return dataset, None


def _get_model_or_error(model_id):
    try:
        trained_model = TrainedModel.objects.get(id=model_id)
    except TrainedModel.DoesNotExist:
        return None, JsonResponse({'error': 'Model not found.'}, status=400)
    return trained_model, None


@api_view(['POST'])
@parser_classes([JSONParser])
def train(request):
    dataset_id = request.data.get('dataset_id')
    target_column = request.data.get('target_column')
    problem_type = request.data.get('problem_type')

    if not dataset_id or not target_column or not problem_type:
        return JsonResponse({'error': 'dataset_id, target_column, and problem_type are required.'}, status=400)

    dataset, error_response = _get_dataset_or_error(dataset_id)
    if error_response:
        return error_response

    file_path = dataset.cleaned_file.path if dataset.is_cleaned and dataset.cleaned_file else dataset.file.path

    try:
        model, metrics, feature_columns = train_model(file_path, target_column, problem_type)
    except ValueError as exc:
        return JsonResponse({'error': str(exc)}, status=400)

    model_filename = f'model_{dataset.id}_{problem_type}.pkl'
    model_storage_path = Path(dataset.file.storage.location) / 'models' / model_filename
    model_storage_path.parent.mkdir(parents=True, exist_ok=True)
    save_model(model, model_storage_path)

    metrics['feature_columns'] = feature_columns

    with open(model_storage_path, 'rb') as model_file:
        trained_model = TrainedModel.objects.create(
            dataset=dataset,
            model_type=problem_type,
            target_column=target_column,
            metrics=metrics,
        )
        trained_model.model_file.save(model_filename, File(model_file), save=True)

    serializer = TrainedModelSerializer(trained_model)
    return JsonResponse({
        'message': 'Model trained successfully.',
        'model': serializer.data,
    }, status=201)


@api_view(['POST'])
@parser_classes([JSONParser])
def make_prediction(request):
    model_id = request.data.get('model_id')
    features_payload = request.data.get('features')

    if not model_id or features_payload is None:
        return JsonResponse({'error': 'model_id and features are required.'}, status=400)

    trained_model, error_response = _get_model_or_error(model_id)
    if error_response:
        return error_response

    model = load_model(trained_model.model_file.path)
    feature_columns = trained_model.metrics.get('feature_columns', [])
    predictions = predict(model, feature_columns, features_payload)

    return JsonResponse({
        'message': 'Prediction generated successfully.',
        'model_id': trained_model.id,
        'predictions': predictions,
    }, status=200)
