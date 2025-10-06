from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ResortViewSet, RoomTypeViewSet, ResortAmenityViewSet

router = DefaultRouter()
router.register(r'resorts', ResortViewSet)
router.register(r'room-types', RoomTypeViewSet, basename='roomtype')
router.register(r'amenities', ResortAmenityViewSet)

urlpatterns = [
    path('', include(router.urls)),
]