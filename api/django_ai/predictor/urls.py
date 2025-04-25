from django.urls import path
from . import views

urlpatterns = [
    path('predict', views.predict_image, name='predict_image'),
    path('verify', views.verify_food_name, name='verify_food_name'),
    path('process-video/', views.process_video, name='process_video'),
]

