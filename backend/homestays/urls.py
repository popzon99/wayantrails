from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    HomestayViewSet, HomestayRoomViewSet, HomestayAmenityViewSet,
    MealPlanViewSet, ExperienceViewSet
)

router = DefaultRouter()
router.register(r'homestays', HomestayViewSet)
router.register(r'rooms', HomestayRoomViewSet, basename='homestayroom')
router.register(r'amenities', HomestayAmenityViewSet)
router.register(r'meal-plans', MealPlanViewSet, basename='mealplan')
router.register(r'experiences', ExperienceViewSet, basename='experience')

urlpatterns = [
    path('', include(router.urls)),
]