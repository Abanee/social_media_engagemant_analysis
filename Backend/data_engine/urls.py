from django.urls import path

from . import views

urlpatterns = [
    path('upload/', views.upload_dataset, name='upload-dataset'),
    path('preprocess/<int:dataset_id>/', views.preprocess_dataset, name='preprocess-dataset'),
    path('eda/<int:dataset_id>/', views.eda_dataset, name='eda-dataset'),
]
