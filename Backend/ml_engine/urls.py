from django.urls import path

from . import views

urlpatterns = [
    path('train/', views.train, name='train-model'),
    path('predict/', views.make_prediction, name='predict'),
]
