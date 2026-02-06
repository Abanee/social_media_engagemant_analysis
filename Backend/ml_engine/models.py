from django.db import models

from data_engine.models import Dataset


def model_upload_path(instance, filename):
    return f'models/{filename}'


class TrainedModel(models.Model):
    PROBLEM_TYPES = [
        ('regression', 'Regression'),
        ('classification', 'Classification'),
    ]

    dataset = models.ForeignKey(Dataset, on_delete=models.CASCADE, related_name='trained_models')
    model_type = models.CharField(max_length=32, choices=PROBLEM_TYPES)
    target_column = models.CharField(max_length=255)
    metrics = models.JSONField(default=dict)
    model_file = models.FileField(upload_to=model_upload_path)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Model {self.id} ({self.model_type})'
