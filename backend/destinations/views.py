"""
Views for Destinations app.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Destination, Activity
from .serializers import (
    DestinationSerializer,
    DestinationListSerializer,
    ActivitySerializer,
)


class DestinationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Destination model.
    Provides list, retrieve, and Google Places sync functionality.
    """

    queryset = Destination.objects.filter(is_active=True)
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['destination_type', 'city', 'state', 'is_featured', 'is_free_entry']
    search_fields = ['name', 'description', 'city', 'state']
    ordering_fields = ['name', 'google_rating', 'entry_fee', 'created_at']
    ordering = ['-is_featured', '-google_rating']
    lookup_field = 'slug'

    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'list':
            return DestinationListSerializer
        return DestinationSerializer

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticatedOrReadOnly])
    def sync_google_places(self, request, slug=None):
        """
        Sync destination with Google Places API.
        POST /api/destinations/{slug}/sync_google_places/
        """
        destination = self.get_object()

        try:
            success = destination.sync_with_google_places()

            if success:
                serializer = self.get_serializer(destination)
                return Response({
                    'success': True,
                    'message': 'Successfully synced with Google Places',
                    'data': serializer.data,
                })
            else:
                return Response({
                    'success': False,
                    'message': 'Could not find place on Google Places',
                }, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({
                'success': False,
                'message': f'Error syncing with Google Places: {str(e)}',
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """
        Get featured destinations.
        GET /api/destinations/featured/
        """
        featured_destinations = self.queryset.filter(is_featured=True)[:6]
        serializer = DestinationListSerializer(featured_destinations, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_type(self, request):
        """
        Get destinations grouped by type.
        GET /api/destinations/by_type/
        """
        destination_types = {}
        for type_code, type_name in Destination.DESTINATION_TYPES:
            destinations = self.queryset.filter(destination_type=type_code)[:4]
            destination_types[type_code] = {
                'name': type_name,
                'destinations': DestinationListSerializer(destinations, many=True).data,
            }

        return Response(destination_types)


class ActivityViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Activity model.
    Provides list and retrieve functionality.
    """

    queryset = Activity.objects.filter(is_active=True)
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['activity_type', 'destination', 'is_featured']
    search_fields = ['name', 'description', 'destination__name']
    ordering_fields = ['name', 'price_per_person', 'duration_hours', 'created_at']
    ordering = ['-is_featured', 'price_per_person']
    lookup_field = 'slug'

    @action(detail=False, methods=['get'])
    def by_destination(self, request):
        """
        Get activities by destination slug.
        GET /api/activities/by_destination/?destination=edakkal-caves
        """
        destination_slug = request.query_params.get('destination')

        if not destination_slug:
            return Response({
                'error': 'destination parameter is required'
            }, status=status.HTTP_400_BAD_REQUEST)

        activities = self.queryset.filter(destination__slug=destination_slug)
        serializer = self.get_serializer(activities, many=True)
        return Response(serializer.data)
