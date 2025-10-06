"""
Homestay API views for WayanTrails platform.
"""
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend

from .models import Homestay, HomestayRoom, HomestayAmenity, MealPlan, Experience
from .serializers import (
    HomestayListSerializer, HomestayDetailSerializer, HomestayCreateUpdateSerializer,
    HomestayRoomSerializer, HomestayAmenitySerializer, MealPlanSerializer,
    ExperienceSerializer
)


class HomestayViewSet(viewsets.ModelViewSet):
    """ViewSet for homestay CRUD operations."""

    queryset = Homestay.objects.filter(is_active=True).select_related().prefetch_related(
        'rooms', 'meal_plans', 'experiences', 'amenity_mappings__amenity'
    )
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['homestay_type', 'city', 'provides_meals', 'is_featured', 'is_verified']
    search_fields = ['name', 'description', 'host_name', 'city']
    ordering_fields = ['name', 'price_per_night', 'max_guests', 'created_at']
    ordering = ['-is_featured', '-created_at']
    lookup_field = 'slug'

    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'list':
            return HomestayListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return HomestayCreateUpdateSerializer
        return HomestayDetailSerializer

    def get_queryset(self):
        """Filter queryset based on query parameters."""
        queryset = self.queryset

        # Price range filtering
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')

        if min_price:
            queryset = queryset.filter(price_per_night__gte=min_price)
        if max_price:
            queryset = queryset.filter(price_per_night__lte=max_price)

        # Guest capacity filtering
        guests = self.request.query_params.get('guests')
        if guests:
            queryset = queryset.filter(max_guests__gte=guests)

        return queryset

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured homestays."""
        featured_homestays = self.get_queryset().filter(is_featured=True)[:6]
        serializer = HomestayListSerializer(featured_homestays, many=True, context={'request': request})
        return Response(serializer.data)


class HomestayRoomViewSet(viewsets.ModelViewSet):
    """ViewSet for homestay room operations."""

    serializer_class = HomestayRoomSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['homestay', 'room_type', 'is_active']
    ordering = ['base_price']

    def get_queryset(self):
        return HomestayRoom.objects.filter(is_active=True, homestay__is_active=True)


class HomestayAmenityViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for homestay amenities."""

    queryset = HomestayAmenity.objects.all().order_by('category', 'name')
    serializer_class = HomestayAmenitySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category']
    search_fields = ['name']


class MealPlanViewSet(viewsets.ModelViewSet):
    """ViewSet for meal plan operations."""

    serializer_class = MealPlanSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['homestay', 'meal_type', 'is_active']

    def get_queryset(self):
        return MealPlan.objects.filter(is_active=True, homestay__is_active=True)


class ExperienceViewSet(viewsets.ModelViewSet):
    """ViewSet for experience operations."""

    serializer_class = ExperienceSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['homestay', 'experience_type', 'is_active']
    search_fields = ['name', 'description']
    ordering = ['price_per_person']
    lookup_field = 'slug'

    def get_queryset(self):
        return Experience.objects.filter(is_active=True, homestay__is_active=True)
