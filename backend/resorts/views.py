"""
Resort API views for WayanTrails platform.
"""
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q

from .models import Resort, RoomType, ResortAmenity
from .serializers import (
    ResortListSerializer, ResortDetailSerializer, ResortCreateUpdateSerializer,
    RoomTypeSerializer, ResortAmenitySerializer
)


class ResortViewSet(viewsets.ModelViewSet):
    """ViewSet for resort CRUD operations."""

    queryset = Resort.objects.filter(is_active=True).select_related().prefetch_related(
        'room_types', 'amenity_mappings__amenity', 'seasonal_pricing'
    )
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['resort_type', 'star_rating', 'city', 'is_featured', 'is_verified']
    search_fields = ['name', 'description', 'city', 'address_line_1']
    ordering_fields = ['name', 'price_range_min', 'star_rating', 'created_at']
    ordering = ['-is_featured', '-created_at']
    lookup_field = 'slug'

    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'list':
            return ResortListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return ResortCreateUpdateSerializer
        return ResortDetailSerializer

    def get_queryset(self):
        """Filter queryset based on query parameters."""
        queryset = self.queryset

        # Price range filtering
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')

        if min_price:
            queryset = queryset.filter(price_range_min__gte=min_price)
        if max_price:
            queryset = queryset.filter(price_range_max__lte=max_price)

        # Amenity filtering
        amenities = self.request.query_params.getlist('amenities')
        if amenities:
            queryset = queryset.filter(amenity_mappings__amenity__id__in=amenities).distinct()

        return queryset

    @action(detail=True, methods=['get'])
    def availability(self, request, slug=None):
        """Check availability for specific dates."""
        resort = self.get_object()
        check_in = request.query_params.get('check_in')
        check_out = request.query_params.get('check_out')

        if not check_in or not check_out:
            return Response(
                {'error': 'check_in and check_out dates are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # TODO: Implement availability logic
        return Response({
            'resort': resort.name,
            'check_in': check_in,
            'check_out': check_out,
            'available': True,  # Placeholder
            'available_rooms': []  # Placeholder
        })

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured resorts."""
        featured_resorts = self.get_queryset().filter(is_featured=True)[:6]
        serializer = ResortListSerializer(featured_resorts, many=True, context={'request': request})
        return Response(serializer.data)


class RoomTypeViewSet(viewsets.ModelViewSet):
    """ViewSet for room type operations."""

    serializer_class = RoomTypeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['resort', 'room_type', 'is_active']
    ordering_fields = ['name', 'base_price', 'max_occupancy']
    ordering = ['base_price']

    def get_queryset(self):
        return RoomType.objects.filter(is_active=True, resort__is_active=True)


class ResortAmenityViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for resort amenities (read-only)."""

    queryset = ResortAmenity.objects.all().order_by('category', 'name')
    serializer_class = ResortAmenitySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category']
    search_fields = ['name', 'description']
