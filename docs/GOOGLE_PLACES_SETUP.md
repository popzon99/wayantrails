# Google Places API Setup Guide

This guide will help you set up Google Places API for WayanTrails to fetch real-time destination data.

## Why Google Places API?

- **Free Tier**: $200/month free credit (~28,000 Place Details requests/month)
- **Real-time Data**: Get up-to-date information about destinations
- **Rich Information**: Photos, reviews, ratings, opening hours, contact details
- **Zero Cost**: Perfect for starting out

## What You'll Get

### For Destinations (Waterfalls, Treks, Cultural Sites):
- ✅ Opening hours and current status (open/closed)
- ✅ Phone numbers and website URLs
- ✅ High-quality photos (up to 10 per place)
- ✅ User ratings and reviews from Google
- ✅ Accessibility features (wheelchair access, parking)
- ✅ GPS coordinates and address verification

### What's NOT Included:
- ❌ Hotel-style amenities (WiFi, AC, pool) - Use custom system for this
- ❌ Room types/pricing - Use custom system
- ❌ Real-time availability - Use booking system

---

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click **Select a Project** → **New Project**
4. Enter project details:
   - **Project Name**: `WayanTrails` (or your choice)
   - **Organization**: Leave default
5. Click **Create**

---

## Step 2: Enable Google Places API

1. In Google Cloud Console, go to **APIs & Services** → **Library**
2. Search for **"Places API"**
3. Click on **Places API (New)**
4. Click **Enable**

**Note**: You may also want to enable:
- **Maps JavaScript API** (for frontend maps)
- **Geocoding API** (for address validation)

---

## Step 3: Create API Key

1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **API key**
3. Your API key will be created (looks like: `AIzaSyD...`)
4. Click **Edit API key** (pencil icon)

### Configure API Key Restrictions (IMPORTANT for security):

#### Application Restrictions:
- For **development**: Select "None" (temporary)
- For **production**: Select "HTTP referrers" and add:
  ```
  http://localhost:3000/*
  https://yourdomain.com/*
  https://www.yourdomain.com/*
  ```

#### API Restrictions:
- Select **Restrict key**
- Choose these APIs:
  - Places API (New)
  - Maps JavaScript API (if using maps)
  - Geocoding API (if using geocoding)

5. Click **Save**

---

## Step 4: Add API Key to WayanTrails

### Backend Setup:

1. Create a `.env` file in `backend/` directory (if not exists):
   ```bash
   cp .env.example .env
   ```

2. Add your API key to `.env`:
   ```env
   GOOGLE_PLACES_API_KEY=AIzaSyD_your_actual_api_key_here
   ```

3. Install the required package:
   ```bash
   cd backend
   pip install googlemaps==4.10.0
   ```

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

---

## Step 5: Test the Integration

### Using Django Admin:

1. Start your Django server:
   ```bash
   cd backend
   python manage.py runserver
   ```

2. Go to admin panel: `http://localhost:8000/admin`

3. Navigate to **Destinations**

4. Select a destination (or create a new one)

5. Click **Actions** dropdown → **Sync with Google Places**

6. Click **Go**

7. Check if the destination now shows:
   - Google rating (⭐⭐⭐⭐⭐)
   - Google reviews
   - Opening hours
   - Contact information

### Using API:

Test the API endpoint:
```bash
# Get all destinations with Google data
curl http://localhost:8000/api/destinations/

# Get specific destination
curl http://localhost:8000/api/destinations/edakkal-caves/

# Manually sync a destination
curl -X POST http://localhost:8000/api/destinations/edakkal-caves/sync_google_places/
```

---

## Step 6: Monitor API Usage

### Check Your Quota:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Dashboard**
3. Click on **Places API (New)**
4. View **Metrics** tab to see:
   - Requests per day
   - Errors
   - Traffic

### Free Tier Limits:

- **$200 free credit per month**
- Place Details: ~0.017 USD per request
- With $200 credit = **~11,700 requests/month** (plenty for starting out!)
- Text Search: ~0.032 USD per request

### Cost Optimization Tips:

1. **Cache results**: Don't sync every page load
2. **Sync strategically**:
   - Sync when destination is created/edited
   - Schedule weekly sync for popular destinations
   - Don't sync on every API call
3. **Use specific fields**: Request only fields you need
4. **Monitor usage**: Set up budget alerts in Google Cloud

---

## Step 7: Set Up Budget Alerts (Recommended)

1. Go to **Billing** → **Budgets & alerts**
2. Click **CREATE BUDGET**
3. Set budget amount: `$200` (or lower)
4. Set alert threshold: `50%`, `90%`, `100%`
5. Add your email for notifications
6. Click **Finish**

---

## Frontend Integration

Use the Google Places data in your React components:

```tsx
import GooglePlacesInfo from '@/components/destinations/GooglePlacesInfo';

export default function DestinationPage({ destination }) {
  return (
    <div>
      {/* Your existing content */}

      {/* Google Places Information */}
      <GooglePlacesInfo
        googleRating={destination.google_rating}
        googleTotalRatings={destination.google_total_ratings}
        googleMapsUrl={destination.google_maps_url}
        googlePhone={destination.google_phone}
        googleWebsite={destination.google_website}
        googleReviews={destination.google_reviews}
        googleOpeningHours={destination.google_opening_hours}
      />
    </div>
  );
}
```

---

## Troubleshooting

### "API key not valid" Error

**Solution**:
1. Check if Places API is enabled in Google Cloud Console
2. Wait 5 minutes after creating the key (propagation delay)
3. Verify API key in `.env` file (no quotes, no spaces)

### "No results found" Error

**Solution**:
1. Check if destination name is accurate
2. Try adding location: `"Edakkal Caves Wayanad Kerala"`
3. Verify GPS coordinates are correct
4. Some locations may not be in Google Places database

### "Quota exceeded" Error

**Solution**:
1. Check your Google Cloud Console quota
2. Enable billing (but you'll still use free credit)
3. Reduce sync frequency
4. Implement caching

### "Invalid request" Error

**Solution**:
1. Check API key restrictions (make sure localhost is allowed)
2. Verify `GOOGLE_PLACES_API_KEY` is set in settings
3. Check logs: `python manage.py runserver` for detailed errors

---

## API Endpoints

### Destinations API:

```bash
# List all destinations
GET /api/destinations/

# Get featured destinations
GET /api/destinations/featured/

# Get destinations by type
GET /api/destinations/by_type/

# Get single destination (with Google data)
GET /api/destinations/{slug}/

# Manually sync with Google Places
POST /api/destinations/{slug}/sync_google_places/
```

### Activities API:

```bash
# List all activities
GET /api/activities/

# Get activities for a destination
GET /api/activities/by_destination/?destination=edakkal-caves

# Get single activity
GET /api/activities/{slug}/
```

---

## Best Practices

### 1. **Sync Frequency**
- ✅ Sync when creating/editing destinations in admin
- ✅ Schedule weekly sync for featured destinations
- ❌ Don't sync on every user request

### 2. **Data Freshness**
- Store `google_last_synced` timestamp
- Show "Updated X days ago" to users
- Re-sync if data is older than 7 days

### 3. **Error Handling**
- Gracefully handle missing Google data
- Show custom data if Google sync fails
- Log errors for debugging

### 4. **User Experience**
- Show Google attribution: "Information from Google Places"
- Link to Google Maps for full details
- Display both Google ratings and your custom reviews

---

## Hybrid Approach (Recommended)

Use Google Places for **destinations** (waterfalls, treks) and keep your custom amenity system for **properties** (homestays, resorts):

| Feature | Google Places | Custom System |
|---------|---------------|---------------|
| Destinations | ✅ Use this | ❌ Not needed |
| Homestays | ❌ Limited data | ✅ Full control |
| Resorts | ❌ Limited data | ✅ Full control |
| Rentals | ❌ Not applicable | ✅ Required |

---

## Support

### Google Documentation:
- [Places API Documentation](https://developers.google.com/maps/documentation/places/web-service/overview)
- [API Key Best Practices](https://developers.google.com/maps/api-security-best-practices)
- [Billing & Pricing](https://mapsplatform.google.com/pricing/)

### WayanTrails Support:
- Check `backend/core/services.py` for implementation
- Review `backend/destinations/models.py` for data structure
- See `frontend/src/components/destinations/GooglePlacesInfo.tsx` for UI

---

## Summary

You've successfully set up Google Places API! Now you can:

1. ✅ Fetch real-time destination data
2. ✅ Display Google ratings and reviews
3. ✅ Show accurate opening hours
4. ✅ Provide verified contact information
5. ✅ Enhance SEO with structured data

**Next Steps**:
- Add destinations in Django admin
- Sync them with Google Places
- Display the data on your frontend
- Monitor your API usage
- Set up automated weekly sync (optional)

Enjoy your zero-cost real-time amenity data! 🎉
