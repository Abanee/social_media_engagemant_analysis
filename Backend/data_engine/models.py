from django.db import models


def dataset_upload_path(instance, filename):
    return f'datasets/{filename}'


def cleaned_upload_path(instance, filename):
    return f'datasets/cleaned_{filename}'


class Dataset(models.Model):
    file = models.FileField(upload_to=dataset_upload_path)
    cleaned_file = models.FileField(upload_to=cleaned_upload_path, null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    is_cleaned = models.BooleanField(default=False)

    def __str__(self):
        return f'Dataset {self.id} - {self.file.name}'
