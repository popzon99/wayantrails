"""
Management command to populate comprehensive amenities data.
"""
from django.core.management.base import BaseCommand
from homestays.models import HomestayAmenity
from resorts.models import ResortAmenity


class Command(BaseCommand):
    help = 'Populate comprehensive amenities for homestays and resorts'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS('Populating amenities...'))

        # Homestay Amenities
        homestay_amenities = [
            # Property Features
            {'name': 'Swimming Pool', 'category': 'property', 'icon': 'swimming-pool', 'amenity_type': 'boolean', 'is_premium': True, 'display_priority': 100},
            {'name': 'Garden', 'category': 'property', 'icon': 'garden', 'amenity_type': 'boolean', 'display_priority': 90},
            {'name': 'Terrace', 'category': 'property', 'icon': 'terrace', 'amenity_type': 'boolean', 'display_priority': 85},
            {'name': 'Playground', 'category': 'property', 'icon': 'playground', 'amenity_type': 'boolean', 'display_priority': 80},
            {'name': 'Parking', 'category': 'property', 'icon': 'parking', 'amenity_type': 'count', 'display_priority': 95},
            {'name': 'Balcony', 'category': 'property', 'icon': 'balcony', 'amenity_type': 'boolean', 'display_priority': 70},
            {'name': 'Veranda', 'category': 'property', 'icon': 'veranda', 'amenity_type': 'boolean', 'display_priority': 65},
            {'name': 'Courtyard', 'category': 'property', 'icon': 'courtyard', 'amenity_type': 'boolean', 'display_priority': 60},

            # Room Features
            {'name': 'Air Conditioning', 'category': 'room', 'icon': 'ac', 'amenity_type': 'boolean', 'display_priority': 100},
            {'name': 'Television', 'category': 'room', 'icon': 'tv', 'amenity_type': 'boolean', 'display_priority': 90},
            {'name': 'Minibar', 'category': 'room', 'icon': 'minibar', 'amenity_type': 'boolean', 'is_premium': True, 'display_priority': 85},
            {'name': 'Coffee Maker', 'category': 'room', 'icon': 'coffee', 'amenity_type': 'boolean', 'display_priority': 80},
            {'name': 'Room Heater', 'category': 'room', 'icon': 'heater', 'amenity_type': 'boolean', 'display_priority': 75},
            {'name': 'WiFi', 'category': 'room', 'icon': 'wifi', 'amenity_type': 'boolean', 'display_priority': 95},
            {'name': 'Ceiling Fan', 'category': 'room', 'icon': 'fan', 'amenity_type': 'boolean', 'display_priority': 70},
            {'name': 'Wardrobe', 'category': 'room', 'icon': 'wardrobe', 'amenity_type': 'boolean', 'display_priority': 65},
            {'name': 'Study Table', 'category': 'room', 'icon': 'desk', 'amenity_type': 'boolean', 'display_priority': 60},
            {'name': 'Safe Locker', 'category': 'room', 'icon': 'safe', 'amenity_type': 'boolean', 'display_priority': 55},
            {'name': 'Iron & Ironing Board', 'category': 'room', 'icon': 'iron', 'amenity_type': 'boolean', 'display_priority': 50},
            {'name': 'Hair Dryer', 'category': 'room', 'icon': 'hairdryer', 'amenity_type': 'boolean', 'display_priority': 45},

            # Services
            {'name': 'Housekeeping', 'category': 'services', 'icon': 'cleaning', 'amenity_type': 'text', 'display_priority': 100},
            {'name': 'Laundry Service', 'category': 'services', 'icon': 'laundry', 'amenity_type': 'boolean', 'display_priority': 95},
            {'name': 'Airport Pickup', 'category': 'services', 'icon': 'airport', 'amenity_type': 'boolean', 'is_premium': True, 'display_priority': 90},
            {'name': 'Guided Tours', 'category': 'services', 'icon': 'tour', 'amenity_type': 'boolean', 'display_priority': 85},
            {'name': 'Room Service', 'category': 'services', 'icon': 'room-service', 'amenity_type': 'text', 'display_priority': 80},
            {'name': 'Concierge', 'category': 'services', 'icon': 'concierge', 'amenity_type': 'boolean', 'display_priority': 75},
            {'name': 'Doctor on Call', 'category': 'services', 'icon': 'medical', 'amenity_type': 'boolean', 'display_priority': 70},
            {'name': 'Bicycle Rental', 'category': 'services', 'icon': 'bicycle', 'amenity_type': 'boolean', 'display_priority': 65},

            # Dining
            {'name': 'Restaurant', 'category': 'dining', 'icon': 'restaurant', 'amenity_type': 'text', 'display_priority': 100},
            {'name': 'Breakfast Included', 'category': 'dining', 'icon': 'breakfast', 'amenity_type': 'boolean', 'display_priority': 95},
            {'name': 'MAP (Breakfast + Dinner)', 'category': 'dining', 'icon': 'meal-plan', 'amenity_type': 'boolean', 'display_priority': 90},
            {'name': 'AP (All Meals)', 'category': 'dining', 'icon': 'all-meals', 'amenity_type': 'boolean', 'display_priority': 85},
            {'name': 'Traditional Kerala Cuisine', 'category': 'dining', 'icon': 'local-food', 'amenity_type': 'boolean', 'display_priority': 80},
            {'name': 'Vegetarian Options', 'category': 'dining', 'icon': 'vegetarian', 'amenity_type': 'boolean', 'display_priority': 75},
            {'name': 'Vegan Options', 'category': 'dining', 'icon': 'vegan', 'amenity_type': 'boolean', 'display_priority': 70},
            {'name': 'Jain Food', 'category': 'dining', 'icon': 'jain', 'amenity_type': 'boolean', 'display_priority': 65},
            {'name': 'Dining Area', 'category': 'dining', 'icon': 'dining', 'amenity_type': 'boolean', 'display_priority': 60},

            # Activities
            {'name': 'Indoor Games', 'category': 'activities', 'icon': 'games', 'amenity_type': 'list', 'display_priority': 100},
            {'name': 'Outdoor Activities', 'category': 'activities', 'icon': 'outdoor', 'amenity_type': 'list', 'display_priority': 95},
            {'name': 'Nature Walks', 'category': 'activities', 'icon': 'hiking', 'amenity_type': 'boolean', 'display_priority': 90},
            {'name': 'Campfire', 'category': 'activities', 'icon': 'campfire', 'amenity_type': 'boolean', 'display_priority': 85},
            {'name': 'Bird Watching', 'category': 'activities', 'icon': 'bird', 'amenity_type': 'boolean', 'display_priority': 80},
            {'name': 'Cooking Classes', 'category': 'activities', 'icon': 'cooking', 'amenity_type': 'boolean', 'is_premium': True, 'display_priority': 75},
            {'name': 'Yoga Sessions', 'category': 'activities', 'icon': 'yoga', 'amenity_type': 'boolean', 'display_priority': 70},
            {'name': 'Farm Tour', 'category': 'activities', 'icon': 'farm', 'amenity_type': 'boolean', 'display_priority': 65},
            {'name': 'Cultural Programs', 'category': 'activities', 'icon': 'culture', 'amenity_type': 'boolean', 'display_priority': 60},

            # Safety & Security
            {'name': 'CCTV Surveillance', 'category': 'safety', 'icon': 'cctv', 'amenity_type': 'boolean', 'display_priority': 100},
            {'name': 'Fire Extinguisher', 'category': 'safety', 'icon': 'fire-extinguisher', 'amenity_type': 'boolean', 'display_priority': 95},
            {'name': 'First Aid Kit', 'category': 'safety', 'icon': 'first-aid', 'amenity_type': 'boolean', 'display_priority': 90},
            {'name': 'Security Guard', 'category': 'safety', 'icon': 'security', 'amenity_type': 'boolean', 'display_priority': 85},
            {'name': 'Smoke Detector', 'category': 'safety', 'icon': 'smoke-detector', 'amenity_type': 'boolean', 'display_priority': 80},
            {'name': 'Emergency Exit', 'category': 'safety', 'icon': 'exit', 'amenity_type': 'boolean', 'display_priority': 75},

            # Outdoor Areas
            {'name': 'BBQ Area', 'category': 'outdoor', 'icon': 'bbq', 'amenity_type': 'boolean', 'display_priority': 100},
            {'name': 'Outdoor Seating', 'category': 'outdoor', 'icon': 'outdoor-seating', 'amenity_type': 'boolean', 'display_priority': 95},
            {'name': 'Bonfire Pit', 'category': 'outdoor', 'icon': 'bonfire', 'amenity_type': 'boolean', 'display_priority': 90},
            {'name': 'Gazebo', 'category': 'outdoor', 'icon': 'gazebo', 'amenity_type': 'boolean', 'display_priority': 85},
            {'name': 'Hammock', 'category': 'outdoor', 'icon': 'hammock', 'amenity_type': 'count', 'display_priority': 80},

            # Entertainment
            {'name': 'Library', 'category': 'entertainment', 'icon': 'library', 'amenity_type': 'boolean', 'display_priority': 100},
            {'name': 'Music System', 'category': 'entertainment', 'icon': 'music', 'amenity_type': 'boolean', 'display_priority': 95},
            {'name': 'Board Games', 'category': 'entertainment', 'icon': 'board-games', 'amenity_type': 'boolean', 'display_priority': 90},
            {'name': 'Card Games', 'category': 'entertainment', 'icon': 'cards', 'amenity_type': 'boolean', 'display_priority': 85},
            {'name': 'Netflix/Streaming', 'category': 'entertainment', 'icon': 'streaming', 'amenity_type': 'boolean', 'is_premium': True, 'display_priority': 80},

            # Kitchen & Dining
            {'name': 'Shared Kitchen', 'category': 'kitchen', 'icon': 'kitchen', 'amenity_type': 'boolean', 'display_priority': 100},
            {'name': 'Refrigerator', 'category': 'kitchen', 'icon': 'fridge', 'amenity_type': 'boolean', 'display_priority': 95},
            {'name': 'Microwave', 'category': 'kitchen', 'icon': 'microwave', 'amenity_type': 'boolean', 'display_priority': 90},
            {'name': 'Induction Cooktop', 'category': 'kitchen', 'icon': 'stove', 'amenity_type': 'boolean', 'display_priority': 85},
            {'name': 'Utensils Provided', 'category': 'kitchen', 'icon': 'utensils', 'amenity_type': 'boolean', 'display_priority': 80},
            {'name': 'Water Purifier', 'category': 'kitchen', 'icon': 'water-filter', 'amenity_type': 'boolean', 'display_priority': 75},
        ]

        # Resort Amenities (more comprehensive)
        resort_amenities = [
            # Property Features
            {'name': 'Swimming Pool', 'category': 'property', 'icon': 'swimming-pool', 'amenity_type': 'text', 'is_premium': True, 'display_priority': 100},
            {'name': 'Infinity Pool', 'category': 'property', 'icon': 'infinity-pool', 'amenity_type': 'boolean', 'is_premium': True, 'display_priority': 98},
            {'name': 'Kids Pool', 'category': 'property', 'icon': 'kids-pool', 'amenity_type': 'boolean', 'display_priority': 95},
            {'name': 'Garden', 'category': 'property', 'icon': 'garden', 'amenity_type': 'boolean', 'display_priority': 90},
            {'name': 'Terrace', 'category': 'property', 'icon': 'terrace', 'amenity_type': 'boolean', 'display_priority': 85},
            {'name': 'Playground', 'category': 'property', 'icon': 'playground', 'amenity_type': 'boolean', 'display_priority': 80},
            {'name': 'Parking', 'category': 'property', 'icon': 'parking', 'amenity_type': 'text', 'display_priority': 95},
            {'name': 'Elevator', 'category': 'property', 'icon': 'elevator', 'amenity_type': 'boolean', 'display_priority': 75},
            {'name': 'Conference Hall', 'category': 'property', 'icon': 'conference', 'amenity_type': 'count', 'display_priority': 70},
            {'name': 'Banquet Hall', 'category': 'property', 'icon': 'banquet', 'amenity_type': 'text', 'is_premium': True, 'display_priority': 68},

            # Room Features
            {'name': 'Air Conditioning', 'category': 'room', 'icon': 'ac', 'amenity_type': 'boolean', 'display_priority': 100},
            {'name': 'Television', 'category': 'room', 'icon': 'tv', 'amenity_type': 'text', 'display_priority': 95},
            {'name': 'Minibar', 'category': 'room', 'icon': 'minibar', 'amenity_type': 'boolean', 'is_premium': True, 'display_priority': 90},
            {'name': 'Coffee Maker', 'category': 'room', 'icon': 'coffee', 'amenity_type': 'boolean', 'display_priority': 85},
            {'name': 'Room Heater', 'category': 'room', 'icon': 'heater', 'amenity_type': 'boolean', 'display_priority': 80},
            {'name': 'WiFi', 'category': 'room', 'icon': 'wifi', 'amenity_type': 'text', 'display_priority': 98},
            {'name': 'Jacuzzi', 'category': 'room', 'icon': 'jacuzzi', 'amenity_type': 'boolean', 'is_premium': True, 'display_priority': 92},
            {'name': 'Bathtub', 'category': 'room', 'icon': 'bathtub', 'amenity_type': 'boolean', 'display_priority': 88},
            {'name': 'Safe Locker', 'category': 'room', 'icon': 'safe', 'amenity_type': 'boolean', 'display_priority': 75},
            {'name': 'Iron & Ironing Board', 'category': 'room', 'icon': 'iron', 'amenity_type': 'boolean', 'display_priority': 70},
            {'name': 'Hair Dryer', 'category': 'room', 'icon': 'hairdryer', 'amenity_type': 'boolean', 'display_priority': 65},
            {'name': 'Balcony', 'category': 'room', 'icon': 'balcony', 'amenity_type': 'boolean', 'display_priority': 78},
            {'name': 'Work Desk', 'category': 'room', 'icon': 'desk', 'amenity_type': 'boolean', 'display_priority': 60},

            # Recreation
            {'name': 'Gym', 'category': 'recreation', 'icon': 'gym', 'amenity_type': 'boolean', 'display_priority': 100},
            {'name': 'Game Room', 'category': 'recreation', 'icon': 'game-room', 'amenity_type': 'boolean', 'display_priority': 95},
            {'name': 'Indoor Games', 'category': 'recreation', 'icon': 'games', 'amenity_type': 'list', 'display_priority': 90},
            {'name': 'Tennis Court', 'category': 'recreation', 'icon': 'tennis', 'amenity_type': 'boolean', 'display_priority': 85},
            {'name': 'Badminton Court', 'category': 'recreation', 'icon': 'badminton', 'amenity_type': 'boolean', 'display_priority': 80},
            {'name': 'Billiards', 'category': 'recreation', 'icon': 'billiards', 'amenity_type': 'boolean', 'display_priority': 75},
            {'name': 'Table Tennis', 'category': 'recreation', 'icon': 'table-tennis', 'amenity_type': 'boolean', 'display_priority': 70},

            # Dining
            {'name': 'Multi-Cuisine Restaurant', 'category': 'dining', 'icon': 'restaurant', 'amenity_type': 'text', 'display_priority': 100},
            {'name': 'Coffee Shop', 'category': 'dining', 'icon': 'cafe', 'amenity_type': 'boolean', 'display_priority': 95},
            {'name': 'Bar & Lounge', 'category': 'dining', 'icon': 'bar', 'amenity_type': 'boolean', 'is_premium': True, 'display_priority': 90},
            {'name': 'Breakfast Included', 'category': 'dining', 'icon': 'breakfast', 'amenity_type': 'boolean', 'display_priority': 98},
            {'name': 'MAP (Breakfast + Dinner)', 'category': 'dining', 'icon': 'meal-plan', 'amenity_type': 'boolean', 'display_priority': 92},
            {'name': 'AP (All Meals)', 'category': 'dining', 'icon': 'all-meals', 'amenity_type': 'boolean', 'display_priority': 88},
            {'name': '24/7 Dining', 'category': 'dining', 'icon': '24-7', 'amenity_type': 'boolean', 'display_priority': 85},
            {'name': 'Room Service', 'category': 'dining', 'icon': 'room-service', 'amenity_type': 'text', 'display_priority': 80},
            {'name': 'BBQ Facility', 'category': 'dining', 'icon': 'bbq', 'amenity_type': 'boolean', 'display_priority': 75},

            # Wellness & Spa
            {'name': 'Spa', 'category': 'wellness', 'icon': 'spa', 'amenity_type': 'boolean', 'is_premium': True, 'display_priority': 100},
            {'name': 'Massage Services', 'category': 'wellness', 'icon': 'massage', 'amenity_type': 'boolean', 'is_premium': True, 'display_priority': 95},
            {'name': 'Sauna', 'category': 'wellness', 'icon': 'sauna', 'amenity_type': 'boolean', 'is_premium': True, 'display_priority': 90},
            {'name': 'Steam Room', 'category': 'wellness', 'icon': 'steam', 'amenity_type': 'boolean', 'is_premium': True, 'display_priority': 85},
            {'name': 'Yoga Studio', 'category': 'wellness', 'icon': 'yoga', 'amenity_type': 'boolean', 'display_priority': 80},
            {'name': 'Ayurvedic Center', 'category': 'wellness', 'icon': 'ayurveda', 'amenity_type': 'boolean', 'is_premium': True, 'display_priority': 75},

            # Business
            {'name': 'Business Center', 'category': 'business', 'icon': 'business', 'amenity_type': 'boolean', 'display_priority': 100},
            {'name': 'Meeting Rooms', 'category': 'business', 'icon': 'meeting', 'amenity_type': 'count', 'display_priority': 95},
            {'name': 'Free WiFi', 'category': 'business', 'icon': 'wifi', 'amenity_type': 'boolean', 'display_priority': 90},
            {'name': 'Printer/Fax', 'category': 'business', 'icon': 'printer', 'amenity_type': 'boolean', 'display_priority': 85},

            # Family & Kids
            {'name': 'Kids Club', 'category': 'family', 'icon': 'kids-club', 'amenity_type': 'boolean', 'display_priority': 100},
            {'name': 'Babysitting', 'category': 'family', 'icon': 'babysitting', 'amenity_type': 'boolean', 'display_priority': 95},
            {'name': 'Children Playground', 'category': 'family', 'icon': 'playground', 'amenity_type': 'boolean', 'display_priority': 90},
            {'name': 'Kids Menu', 'category': 'family', 'icon': 'kids-menu', 'amenity_type': 'boolean', 'display_priority': 85},
            {'name': 'Baby Cot Available', 'category': 'family', 'icon': 'cot', 'amenity_type': 'boolean', 'display_priority': 80},

            # Outdoor Activities
            {'name': 'Trekking', 'category': 'outdoor', 'icon': 'trekking', 'amenity_type': 'boolean', 'display_priority': 100},
            {'name': 'Nature Walks', 'category': 'outdoor', 'icon': 'hiking', 'amenity_type': 'boolean', 'display_priority': 95},
            {'name': 'Campfire', 'category': 'outdoor', 'icon': 'campfire', 'amenity_type': 'boolean', 'display_priority': 90},
            {'name': 'Bird Watching', 'category': 'outdoor', 'icon': 'bird', 'amenity_type': 'boolean', 'display_priority': 85},
            {'name': 'Cycling', 'category': 'outdoor', 'icon': 'cycling', 'amenity_type': 'boolean', 'display_priority': 80},
            {'name': 'Wildlife Safari', 'category': 'outdoor', 'icon': 'safari', 'amenity_type': 'boolean', 'is_premium': True, 'display_priority': 75},
            {'name': 'Adventure Sports', 'category': 'outdoor', 'icon': 'adventure', 'amenity_type': 'list', 'is_premium': True, 'display_priority': 70},

            # Transportation
            {'name': 'Airport Transfer', 'category': 'transport', 'icon': 'airport', 'amenity_type': 'boolean', 'is_premium': True, 'display_priority': 100},
            {'name': 'Car Rental', 'category': 'transport', 'icon': 'car-rental', 'amenity_type': 'boolean', 'display_priority': 95},
            {'name': 'Valet Parking', 'category': 'transport', 'icon': 'valet', 'amenity_type': 'boolean', 'display_priority': 90},

            # Services
            {'name': 'Concierge', 'category': 'services', 'icon': 'concierge', 'amenity_type': 'boolean', 'display_priority': 100},
            {'name': '24/7 Front Desk', 'category': 'services', 'icon': 'reception', 'amenity_type': 'boolean', 'display_priority': 95},
            {'name': 'Housekeeping', 'category': 'services', 'icon': 'cleaning', 'amenity_type': 'text', 'display_priority': 90},
            {'name': 'Laundry Service', 'category': 'services', 'icon': 'laundry', 'amenity_type': 'boolean', 'display_priority': 85},
            {'name': 'Doctor on Call', 'category': 'services', 'icon': 'medical', 'amenity_type': 'boolean', 'display_priority': 80},
            {'name': 'Travel Desk', 'category': 'services', 'icon': 'travel', 'amenity_type': 'boolean', 'display_priority': 75},
            {'name': 'Currency Exchange', 'category': 'services', 'icon': 'currency', 'amenity_type': 'boolean', 'display_priority': 70},

            # Activities
            {'name': 'Cultural Programs', 'category': 'activities', 'icon': 'culture', 'amenity_type': 'boolean', 'display_priority': 100},
            {'name': 'Cooking Classes', 'category': 'activities', 'icon': 'cooking', 'amenity_type': 'boolean', 'is_premium': True, 'display_priority': 95},
            {'name': 'Guided Tours', 'category': 'activities', 'icon': 'tour', 'amenity_type': 'boolean', 'display_priority': 90},

            # Safety & Security
            {'name': 'CCTV Surveillance', 'category': 'safety', 'icon': 'cctv', 'amenity_type': 'boolean', 'display_priority': 100},
            {'name': 'Fire Extinguisher', 'category': 'safety', 'icon': 'fire-extinguisher', 'amenity_type': 'boolean', 'display_priority': 95},
            {'name': 'First Aid Kit', 'category': 'safety', 'icon': 'first-aid', 'amenity_type': 'boolean', 'display_priority': 90},
            {'name': 'Security Guard', 'category': 'safety', 'icon': 'security', 'amenity_type': 'boolean', 'display_priority': 85},
            {'name': 'Smoke Detector', 'category': 'safety', 'icon': 'smoke-detector', 'amenity_type': 'boolean', 'display_priority': 80},
            {'name': 'Emergency Exit', 'category': 'safety', 'icon': 'exit', 'amenity_type': 'boolean', 'display_priority': 75},
        ]

        # Create Homestay Amenities
        created_count = 0
        for amenity_data in homestay_amenities:
            amenity, created = HomestayAmenity.objects.get_or_create(
                name=amenity_data['name'],
                defaults=amenity_data
            )
            if created:
                created_count += 1
                self.stdout.write(f'  Created homestay amenity: {amenity.name}')

        self.stdout.write(self.style.SUCCESS(f'Created {created_count} homestay amenities'))

        # Create Resort Amenities
        created_count = 0
        for amenity_data in resort_amenities:
            amenity, created = ResortAmenity.objects.get_or_create(
                name=amenity_data['name'],
                defaults=amenity_data
            )
            if created:
                created_count += 1
                self.stdout.write(f'  Created resort amenity: {amenity.name}')

        self.stdout.write(self.style.SUCCESS(f'Created {created_count} resort amenities'))
        self.stdout.write(self.style.SUCCESS('All amenities populated successfully!'))
