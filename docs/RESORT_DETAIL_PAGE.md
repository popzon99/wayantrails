# Resort Detail Page - Implementation Guide

## 🎯 Overview
Complete implementation guide for resort/property detail pages with mobile and desktop layouts. This document provides exact specifications for Claude Code to implement.

---

## 📱 MOBILE VIEW LAYOUT (320px - 767px)

```
┌─────────────────────────────────────┐
│ ← WayanTrails        🔗 ❤️         │ ← Header (sticky)
├─────────────────────────────────────┤
│                                     │
│  [Main Hero Image - Full Width]    │ ← Swipeable gallery
│  • • • • ◦                         │ ← Dots indicator (5 images)
│                                     │
├─────────────────────────────────────┤
│ 🏆 Luxury  ✓ Verified              │ ← Badges
│                                     │
│ Vythiri Village Resort              │ ← H1 Title
│ 📍 Vythiri, Wayanad                │ ← Location
│                                     │
│ ⭐ 4.9 (248 reviews)  [Share →]    │ ← Rating & Actions
├─────────────────────────────────────┤
│                                     │
│ ▼ About This Resort                │ ← Collapsible
│                                     │
│   Nestled in the heart of...       │
│   [Read More]                       │
│                                     │
├─────────────────────────────────────┤
│                                     │
│ ▼ Room Types & Pricing (3)         │ ← Collapsible (expanded)
│                                     │
│ ┌─────────────────────────────────┐│
│ │ [Room Image - Horizontal]       ││
│ │                                 ││
│ │ Treehouse Villa     ₹15,000/nt ││
│ │ Up to 2 guests                  ││
│ │                                 ││
│ │ Valley View • Private Balcony   ││
│ │ King Bed                        ││
│ │                                 ││
│ │ ⚠️ Only 1 left!                 ││
│ │                                 ││
│ │ [Select Room →]                 ││
│ └─────────────────────────────────┘│
│                                     │
│ ┌─────────────────────────────────┐│
│ │ [Room Image]                    ││
│ │                                 ││
│ │ Forest Cottage      ₹12,000/nt ││
│ │ Up to 3 guests                  ││
│ │                                 ││
│ │ Garden View • Sitting Area      ││
│ │ Queen Bed                       ││
│ │                                 ││
│ │ ✓ Available                     ││
│ │                                 ││
│ │ [Select Room →]                 ││
│ └─────────────────────────────────┘│
│                                     │
│ ┌─────────────────────────────────┐│
│ │ [Room Image]                    ││
│ │                                 ││
│ │ Luxury Suite        ₹18,000/nt ││
│ │ Up to 4 guests                  ││
│ │                                 ││
│ │ Panoramic • Living • 2 Bedrooms ││
│ │                                 ││
│ │ ✓ Available                     ││
│ │                                 ││
│ │ [Select Room →]                 ││
│ └─────────────────────────────────┘│
│                                     │
├─────────────────────────────────────┤
│                                     │
│ ▼ Amenities & Facilities           │ ← Collapsible
│                                     │
│   🏊 Pool & Wellness               │
│   • Infinity Pool (outdoor)        │
│   • Spa & Massage                  │
│   • Yoga Deck                      │
│                                     │
│   🍽️ Dining                        │
│   • Restaurant                     │
│   • Bar & Lounge                   │
│   • 24/7 Room Service              │
│                                     │
│   [Show All 45 Amenities →]        │
│                                     │
├─────────────────────────────────────┤
│                                     │
│ ▼ Location & Nearby                │ ← Collapsible
│                                     │
│ ┌─────────────────────────────────┐│
│ │ [Interactive Map - Full Width]  ││
│ │ • Resort pin                    ││
│ │ • Attraction markers            ││
│ └─────────────────────────────────┘│
│                                     │
│ 📍 Vythiri, Wayanad, Kerala        │
│ [Get Directions] [Share Location]  │
│                                     │
│ 🎯 Nearby Attractions              │
│                                     │
│ ┌───────────────────────────────┐ │
│ │🏔️ Chembra Peak      2.5 km    │ │
│ │  Perfect for: Trekking        │ │
│ │  [Book Trek] [Directions →]   │ │
│ └───────────────────────────────┘ │
│                                     │
│ ┌───────────────────────────────┐ │
│ │💧 Soochipara Falls   3.2 km   │ │
│ │  Perfect for: Nature lovers   │ │
│ │  [View] [Directions →]        │ │
│ └───────────────────────────────┘ │
│                                     │
│ [View All Nearby Places →]         │
│                                     │
├─────────────────────────────────────┤
│                                     │
│ ▼ Guest Reviews (248)              │ ← Collapsible
│                                     │
│ Overall Rating: ⭐ 4.9             │
│                                     │
│ ┌─────────────────────────────────┐│
│ │ PS  Priya Sharma  ⭐⭐⭐⭐⭐    ││
│ │     2 weeks ago                 ││
│ │                                 ││
│ │ "Absolutely stunning! The       ││
│ │ treehouse was magical..."       ││
│ │                                 ││
│ │ 👍 Helpful (24)                 ││
│ └─────────────────────────────────┘│
│                                     │
│ ┌─────────────────────────────────┐│
│ │ RK  Raj Kumar  ⭐⭐⭐⭐⭐        ││
│ │     1 month ago                 ││
│ │                                 ││
│ │ "Perfect blend of luxury and    ││
│ │ nature. Highly recommend!"      ││
│ │                                 ││
│ │ 👍 Helpful (18)                 ││
│ └─────────────────────────────────┘│
│                                     │
│ [View All 248 Reviews →]           │
│                                     │
├─────────────────────────────────────┤
│                                     │
│ ▼ Policies & Information           │ ← Collapsible
│                                     │
│ 🕐 Check-in & Check-out            │
│   Check-in:  2:00 PM - 8:00 PM    │
│   Check-out: 11:00 AM             │
│                                     │
│ ❌ Cancellation Policy             │
│   ✓ Free cancellation until       │
│     3 days before check-in        │
│   [View Full Policy →]            │
│                                     │
│ 👶 Children & Extra Beds           │
│   Children welcome                │
│   Child (0-5 yrs): Free           │
│   [See Details →]                 │
│                                     │
│ 🐕 Pet Policy                      │
│   ❌ Pets not allowed              │
│                                     │
├─────────────────────────────────────┤
│                                     │
│ 🤔 Frequently Asked Questions      │
│                                     │
│ ▶ Is breakfast included?           │
│ ▶ Do you have parking?             │
│ ▶ Is WiFi free?                    │
│                                     │
├─────────────────────────────────────┤
│                                     │
│ Similar Properties Nearby          │
│                                     │
│ [Property Card 1]                  │
│ [Property Card 2]                  │
│ [Property Card 3]                  │
│                                     │
│ [View All Resorts →]               │
│                                     │
└─────────────────────────────────────┘
│                                     │ ← Space for sticky bar
│                                     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ ₹12,000/night   [Check Dates →]   │ ← Sticky Bottom Bar
└─────────────────────────────────────┘
```

---

## 💻 DESKTOP VIEW LAYOUT (1024px+)

```
┌───────────────────────────────────────────────────────────────────────────────┐
│ WayanTrails    Resorts  Homestays  Rentals  Destinations  Services  Sign In  │
└───────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Home > Wayanad > Resorts > Vythiri Village Resort                          │ ← Breadcrumb
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────┬──────────────────────────────────────┐
│                                      │                                      │
│  [Main Large Hero Image]            │  [Grid: 4 smaller images]           │
│  Click to open gallery               │  [View all 24 photos →]             │
│                                      │                                      │
└──────────────────────────────────────┴──────────────────────────────────────┘

┌───────────────────────────────────────────────────────┬─────────────────────┐
│                                                       │                     │
│ 🏆 Luxury  ✓ Verified                                │  ┌─────────────────┐│
│                                                       │  │ STICKY CARD     ││
│ Vythiri Village Resort                               │  ├─────────────────┤│
│ ⭐ 4.9 (248 reviews) • 📍 Vythiri, Wayanad           │  │ From ₹12,000    ││
│ ❤️ Save  🔗 Share                                    │  │ per night       ││
│                                                       │  │                 ││
│ ─────────────────────────────────────────────────    │  │ Check-in        ││
│                                                       │  │ [Date Picker]   ││
│ About This Resort                                     │  │                 ││
│                                                       │  │ Check-out       ││
│ Nestled in the heart of Wayanad, Vythiri Village    │  │ [Date Picker]   ││
│ Resort offers an unparalleled luxury experience      │  │                 ││
│ surrounded by lush rainforests and exotic wildlife.  │  │ Guests          ││
│                                                       │  │ [2 guests ▼]    ││
│ Spread across 150 acres of pristine rainforest,      │  │                 ││
│ this sanctuary is perfect for those seeking           │  │ ───────────────  ││
│ tranquility and adventure.                            │  │                 ││
│                                                       │  │ Select Room:    ││
│ ─────────────────────────────────────────────────    │  │ ○ Treehouse     ││
│                                                       │  │   ₹15,000/night ││
│ Room Types & Live Availability                        │  │ ○ Cottage       ││
│                                                       │  │   ₹12,000/night ││
│ ┌──────────────────────────────────────────────────┐ │  │ ○ Suite         ││
│ │ ┌─────────┐  Treehouse Villa      ₹15,000/night │ │  │   ₹18,000/night ││
│ │ │         │  Up to 2 guests                      │ │  │                 ││
│ │ │  Image  │  Valley View • Private Balcony       │ │  │ ───────────────  ││
│ │ │         │  King Bed                            │ │  │                 ││
│ │ └─────────┘                                       │ │  │ 3 nights        ││
│ │             ✓ Free WiFi  ✓ AC  ✓ Mini Bar       │ │  │ ₹36,000         ││
│ │                                                   │ │  │ + Taxes ₹3,600  ││
│ │             ⚠️ Only 1 room left!                 │ │  │ ───────────────  ││
│ │             [Select This Room →]                 │ │  │ Total: ₹39,600  ││
│ └──────────────────────────────────────────────────┘ │  │                 ││
│                                                       │  │ ✓ Free cancel   ││
│ ┌──────────────────────────────────────────────────┐ │  │ ✓ No prepayment ││
│ │ ┌─────────┐  Forest Cottage       ₹12,000/night │ │  │                 ││
│ │ │         │  Up to 3 guests                      │ │  │ [Check Dates →] ││
│ │ │  Image  │  Garden View • Sitting Area          │ │  │ 🔒 Secure       ││
│ │ │         │  Queen Bed                           │ │  │                 ││
│ │ └─────────┘                                       │ │  └─────────────────┘│
│ │             ✓ Free WiFi  ✓ AC  ✓ Balcony        │ │                     │
│ │                                                   │ │                     │
│ │             ✓ 5 rooms available                  │ │                     │
│ │             [Select This Room →]                 │ │                     │
│ └──────────────────────────────────────────────────┘ │                     │
│                                                       │                     │
│ ┌──────────────────────────────────────────────────┐ │                     │
│ │ ┌─────────┐  Luxury Suite         ₹18,000/night │ │                     │
│ │ │         │  Up to 4 guests                      │ │                     │
│ │ │  Image  │  Panoramic View • Living Room        │ │                     │
│ │ │         │  2 Bedrooms                          │ │                     │
│ │ └─────────┘                                       │ │                     │
│ │             ✓ Free WiFi  ✓ AC  ✓ Kitchen        │ │                     │
│ │                                                   │ │                     │
│ │             ✓ Available                          │ │                     │
│ │             [Select This Room →]                 │ │                     │
│ └──────────────────────────────────────────────────┘ │                     │
│                                                       │                     │
│ ─────────────────────────────────────────────────    │                     │
│                                                       │                     │
│ Amenities & Facilities                                │                     │
│                                                       │                     │
│ 🏊 Pool & Wellness        🍽️ Dining                 │                     │
│ • Infinity Pool           • Restaurant               │                     │
│ • Spa & Massage           • Bar & Lounge            │                     │
│ • Yoga Deck               • 24/7 Room Service       │                     │
│ • Fitness Center          • BBQ Facilities          │                     │
│                                                       │                     │
│ 🏠 Room Features          🚗 Services                │                     │
│ • Air Conditioning        • Free Parking            │                     │
│ • Free WiFi               • Airport Shuttle         │                     │
│ • Mini Bar                • Laundry Service         │                     │
│ • Safe Deposit            • Tour Desk               │                     │
│                                                       │                     │
│ [Show All 45 Amenities →]                            │                     │
│                                                       │                     │
│ ─────────────────────────────────────────────────    │                     │
│                                                       │                     │
│ Location & What's Nearby                              │                     │
│                                                       │                     │
│ ┌──────────────────────────────────────────────────┐ │                     │
│ │ [Interactive Map - Full Width]                   │ │                     │
│ │ • Resort Location (main pin)                     │ │                     │
│ │ • Nearby Attractions (clickable markers)         │ │                     │
│ │ • Distance indicators                            │ │                     │
│ └──────────────────────────────────────────────────┘ │                     │
│                                                       │                     │
│ 📍 Vythiri, Wayanad, Kerala                          │                     │
│ [Get Directions]  [Share Location]                   │                     │
│                                                       │                     │
│ 🎯 Nearby Attractions (Within 5 km)                  │                     │
│                                                       │                     │
│ ┌─────────────────────┬─────────────────────┐        │                     │
│ │ 🏔️ Chembra Peak    │ 💧 Soochipara Falls │        │                     │
│ │ 2.5 km • Trekking  │ 3.2 km • Waterfall  │        │                     │
│ │ [Book] [Directions]│ [View] [Directions] │        │                     │
│ └─────────────────────┴─────────────────────┘        │                     │
│                                                       │                     │
│ ┌─────────────────────┬─────────────────────┐        │                     │
│ │ 🦁 Tholpetty Safari│ 🚶 Edakkal Caves    │        │                     │
│ │ 4.1 km • Wildlife  │ 4.5 km • Historical │        │                     │
│ │ [Book] [Directions]│ [View] [Directions] │        │                     │
│ └─────────────────────┴─────────────────────┘        │                     │
│                                                       │                     │
│ [View All Nearby Places →]                           │                     │
│                                                       │                     │
│ ─────────────────────────────────────────────────    │                     │
│                                                       │                     │
│ Guest Reviews                                         │                     │
│                                                       │                     │
│ Overall Rating: ⭐ 4.9 (248 reviews)                 │                     │
│                                                       │                     │
│ ┌──────────────────────────────────────────────────┐ │                     │
│ │ PS  Priya Sharma              ⭐⭐⭐⭐⭐         │ │                     │
│ │     Mumbai, India • 2 weeks ago                  │ │                     │
│ │     Treehouse Villa • 3 nights                   │ │                     │
│ │                                                   │ │                     │
│ │ "Absolutely stunning! The treehouse was magical  │ │                     │
│ │ and the staff was incredibly hospitable.         │ │                     │
│ │ Breakfast was amazing."                          │ │                     │
│ │                                                   │ │                     │
│ │ 👍 Helpful (24)  💬 Reply                       │ │                     │
│ └──────────────────────────────────────────────────┘ │                     │
│                                                       │                     │
│ ┌──────────────────────────────────────────────────┐ │                     │
│ │ RK  Raj Kumar                 ⭐⭐⭐⭐⭐         │ │                     │
│ │     Bangalore, India • 1 month ago               │ │                     │
│ │     Forest Cottage • 2 nights                    │ │                     │
│ │                                                   │ │                     │
│ │ "Perfect blend of luxury and nature. The food    │ │                     │
│ │ was exceptional and staff very attentive!"       │ │                     │
│ │                                                   │ │                     │
│ │ 👍 Helpful (18)  💬 Reply                       │ │                     │
│ └──────────────────────────────────────────────────┘ │                     │
│                                                       │                     │
│ [View All 248 Reviews →]                             │                     │
│                                                       │                     │
│ ─────────────────────────────────────────────────    │                     │
│                                                       │                     │
│ Policies & Important Information                      │                     │
│                                                       │                     │
│ ┌─────────────────┬────────────────┬──────────────┐  │                     │
│ │ 🕐 Check-in/out│ ❌ Cancellation│ 👶 Children  │  │                     │
│ ├─────────────────┼────────────────┼──────────────┤  │                     │
│ │ In: 2PM - 8PM  │ Free until 3   │ All ages OK  │  │                     │
│ │ Out: 11:00 AM  │ days before    │ 0-5: Free    │  │                     │
│ │                │ [Full Policy→] │ [Details →]  │  │                     │
│ └─────────────────┴────────────────┴──────────────┘  │                     │
│                                                       │                     │
│ ┌─────────────────┬────────────────────────────────┐  │                     │
│ │ 🐕 Pet Policy  │ 📋 House Rules                 │  │                     │
│ ├─────────────────┼────────────────────────────────┤  │                     │
│ │ ❌ Not allowed │ • No smoking in rooms          │  │                     │
│ │                │ • Quiet hours: 10PM - 7AM      │  │                     │
│ │                │ • Valid ID required            │  │                     │
│ └─────────────────┴────────────────────────────────┘  │                     │
│                                                       │                     │
│ ─────────────────────────────────────────────────    │                     │
│                                                       │                     │
│ Frequently Asked Questions                            │                     │
│                                                       │                     │
│ ▼ What are the check-in and check-out times?         │                     │
│   Check-in is from 2:00 PM to 8:00 PM...            │                     │
│                                                       │                     │
│ ▶ Is breakfast included in the room rate?            │                     │
│ ▶ Do you have free parking?                          │                     │
│ ▶ Is WiFi free throughout the property?              │                     │
│ ▶ Are pets allowed?                                  │                     │
│                                                       │                     │
│ ─────────────────────────────────────────────────    │                     │
│                                                       │                     │
│ Similar Properties Nearby                             │                     │
│                                                       │                     │
│ ┌───────────┬───────────┬───────────┐                │                     │
│ │[Property 1│[Property 2│[Property 3│                │                     │
│ │ Image]    │ Image]    │ Image]    │                │                     │
│ │Name       │Name       │Name       │                │                     │
│ │⭐4.7 ₹12K│⭐4.8 ₹14K│⭐4.3 ₹8K │                │                     │
│ └───────────┴───────────┴───────────┘                │                     │
│                                                       │                     │
└───────────────────────────────────────────────────────┴─────────────────────┘
```

---

## 🎨 DETAILED COMPONENT SPECIFICATIONS

### 1. Hero Image Gallery

**Desktop:**
```jsx
<section className="grid grid-cols-2 gap-2 h-[500px]">
  {/* Main large image - left side */}
  <div className="relative cursor-pointer" onClick={openLightbox}>
    <Image 
      src={images[0]} 
      fill 
      className="object-cover rounded-l-lg"
      priority
    />
  </div>
  
  {/* 4 smaller images - right side grid */}
  <div className="grid grid-cols-2 gap-2">
    {images.slice(1, 5).map((img, idx) => (
      <div key={idx} className="relative cursor-pointer" onClick={openLightbox}>
        <Image src={img} fill className="object-cover" />
        {idx === 3 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <button className="text-white">View all {images.length} photos</button>
          </div>
        )}
      </div>
    ))}
  </div>
</section>
```

**Mobile:**
```jsx
<section className="relative h-[300px]">
  {/* Swipeable carousel */}
  <Swiper 
    pagination={{ clickable: true }}
    className="h-full"
  >
    {images.map((img, idx) => (
      <SwiperSlide key={idx}>
        <Image src={img} fill className="object-cover" />
      </SwiperSlide>
    ))}
  </Swiper>
  
  {/* Dots indicator */}
  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
    {images.map((_, idx) => (
      <div key={idx} className="w-2 h-2 rounded-full bg-white/60" />
    ))}
  </div>
</section>
```

---

### 2. Sticky Booking Card (Desktop Only)

```jsx
<aside className="hidden lg:block lg:sticky lg:top-24 w-full lg:w-[380px]">
  <div className="border rounded-xl shadow-lg p-6 bg-white">
    {/* Price Display */}
    <div className="mb-4">
      <span className="text-sm text-gray-600">From</span>
      <div className="text-3xl font-bold">₹{minPrice}</div>
      <span className="text-gray-600">per night</span>
    </div>

    {/* Date Pickers */}
    <div className="grid grid-cols-2 gap-2 mb-4">
      <div className="border rounded p-3">
        <label className="text-xs text-gray-600">Check-in</label>
        <input type="date" className="w-full" />
      </div>
      <div className="border rounded p-3">
        <label className="text-xs text-gray-600">Check-out</label>
        <input type="date" className="w-full" />
      </div>
    </div>

    {/* Guest Selector */}
    <div className="border rounded p-3 mb-4">
      <label className="text-xs text-gray-600">Guests</label>
      <select className="w-full">
        <option>2 guests</option>
        <option>3 guests</option>
        <option>4 guests</option>
      </select>
    </div>

    {/* Room Type Selector */}
    <div className="mb-4 space-y-2">
      <label className="text-sm font-medium">Select Room:</label>
      {roomTypes.map(room => (
        <label key={room.id} className="flex items-center gap-2 p-3 border rounded cursor-pointer hover:bg-gray-50">
          <input type="radio" name="room" value={room.id} />
          <div className="flex-1">
            <div className="font-medium">{room.name}</div>
            <div className="text-sm text-gray-600">₹{room.price}/night</div>
          </div>
        </label>
      ))}
    </div>

    {/* Price Breakdown */}
    <div className="border-t pt-4 mb-4 space-y-2">
      <div className="flex justify-between text-sm">
        <span>₹{selectedRoom.price} × {nights} nights</span>
        <span>₹{baseTotal}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span>Taxes & fees</span>
        <span>₹{taxes}</span>
      </div>
      <div className="flex justify-between font-bold text-lg border-t pt-2">
        <span>Total</span>
        <span>₹{total}</span>
      </div>
    </div>

    {/* Trust Indicators */}
    <div className="mb-4 text-sm text-gray-600 space-y-1">
      <div>✓ Free cancellation</div>
      <div>✓ No prepayment needed</div>
    </div>

    {/* CTA Button */}
    <button className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark">
      Check Availability
    </button>
    <div className="text-center text-xs text-gray-500 mt-2">
      🔒 Secure booking
    </div>
  </div>
</aside>
```

---

### 3. Sticky Bottom Bar (Mobile Only)

```jsx
<div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
  <div className="flex items-center justify-between px-4 py-3">
    <div>
      <div className="text-sm text-gray-600">From</div>
      <div className="text-xl font-bold">₹{minPrice}/night</div>
    </div>
    <button className="bg-primary text-white px-6 py-3 rounded-lg font-medium">
      Check Dates
    </button>
  </div>
</div>
```

---

### 4. Room Types Section

```jsx
<section className="space-y-4">
  <h2 className="text-2xl font-bold">Room Types & Live Availability</h2>
  <p className="text-gray-600">At {resortName}</p>

  {/* Mobile: Stacked cards */}
  <div className="lg:hidden space-y-4">
    {roomTypes.map(room => (
      <div key={room.id} className="border rounded-lg overflow-hidden shadow-sm">
        {/* Room Image */}
        <div className="relative h-48">
          <Image src={room.image} fill className="object-cover" />
          {room.available === 1 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
              Only {room.available} left!
            </span>
          )}
        </div>

        {/* Room Info */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg">{room.name}</h3>
            <div className="text-right">
              <div className="text-xl font-bold">₹{room.price}</div>
              <div className="text-sm text-gray-600">per night</div>
            </div>
          </div>

          <div className="text-sm text-gray-600 mb-3">
            Up to {room.maxGuests} guests
          </div>

          {/* Highlights */}
          <div className="flex flex-wrap gap-2 mb-3">
            {room.highlights.map((highlight, idx) => (
              <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                {highlight}
              </span>
            ))}
          </div>

          {/* Availability Status */}
          <div className="mb-4">
            {room.available > 0 ? (
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <span>✓</span> Available
              </div>
            ) : (
              <div className="flex items-center gap-1 text-red-600 text-sm">
                <span>✕</span> Not available for selected dates
              </div>
            )}
          </div>

          {/* Select Button */}
          <button 
            className={`w-full py-3 rounded-lg font-medium ${
              room.available > 0 
                ? 'bg-primary text-white hover:bg-primary-dark' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            disabled={room.available === 0}
          >
            Select Room →
          </button>
        </div>
      </div>
    ))}
  </div>

  {/* Desktop: Horizontal cards */}
  <div className="hidden lg:block space-y-4">
    {roomTypes.map(room => (
      <div key={room.id} className="border rounded-lg overflow-hidden shadow-sm flex">
        {/* Room Image */}
        <div className="relative w-64 flex-shrink-0">
          <Image src={room.image} fill className="object-cover" />
        </div>

        {/* Room Info */}
        <div className="flex-1 p-6 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-xl mb-1">{room.name}</h3>
              <div className="text-gray-600">Up to {room.maxGuests} guests</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">₹{room.price}</div>
              <div className="text-gray-600">per night</div>
            </div>
          </div>

          {/* Highlights */}
          <div className="flex flex-wrap gap-2 mb-4">
            {room.highlights.map((highlight, idx) => (
              <span key={idx} className="text-sm bg-gray-100 px-3 py-1 rounded">
                {highlight}
              </span>
            ))}
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
            {room.amenities.slice(0, 4).map((amenity, idx) => (
              <span key={idx}>✓ {amenity}</span>
            ))}
          </div>

          {/* Bottom Row */}
          <div className="flex justify-between items-center mt-auto">
            {/* Availability */}
            <div>
              {room.available === 1 ? (
                <span className="text-red-600 font-medium">⚠️ Only 1 room left!</span>
              ) : room.available > 1 ? (
                <span className="text-green-600">✓ {room.available} rooms available</span>
              ) : (
                <span className="text-red-600">✕ Not available</span>
              )}
            </div>

            {/* Select Button */}
            <button 
              className={`px-8 py-3 rounded-lg font-medium ${
                room.available > 0 
                  ? 'bg-primary text-white hover:bg-primary-dark' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              disabled={room.available === 0}
            >
              Select This Room →
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
</section>
```

---

### 5. Amenities Section

```jsx
<section className="space-y-4">
  <h2 className="text-2xl font-bold">Amenities & Facilities</h2>

  {/* Categorized Grid */}
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {amenityCategories.map(category => (
      <div key={category.name}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">{category.icon}</span>
          <h3 className="font-semibold">{category.name}</h3>
        </div>
        <ul className="space-y-2 text-sm text-gray-700">
          {category.items.slice(0, 4).map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>

  {/* Show More Button */}
  <button className="text-primary font-medium hover:underline">
    Show All {totalAmenities} Amenities →
  </button>
</section>

{/* Amenities Data Structure */}
const amenityCategories = [
  {
    name: "Pool & Wellness",
    icon: "🏊",
    items: [
      "Infinity Pool (outdoor)",
      "Spa & Massage",
      "Yoga Deck",
      "Fitness Center"
    ]
  },
  {
    name: "Dining",
    icon: "🍽️",
    items: [
      "Multi-Cuisine Restaurant",
      "Bar & Lounge",
      "24/7 Room Service",
      "BBQ Facilities"
    ]
  },
  {
    name: "Room Features",
    icon: "🏠",
    items: [
      "Air Conditioning",
      "Free WiFi",
      "Mini Bar",
      "Safe Deposit Box"
    ]
  },
  {
    name: "Services",
    icon: "🚗",
    items: [
      "Free Parking",
      "Airport Shuttle (paid)",
      "Laundry Service",
      "Tour Desk"
    ]
  },
  {
    name: "Family Friendly",
    icon: "👨‍👩‍👧",
    items: [
      "Children's Pool",
      "Kids Play Area",
      "Babysitting (on request)",
      "Family Rooms"
    ]
  }
];
```

---

### 6. Location & Nearby Attractions

```jsx
<section className="space-y-6">
  <h2 className="text-2xl font-bold">Location & What's Nearby</h2>

  {/* Interactive Map */}
  <div className="relative h-[400px] rounded-lg overflow-hidden">
    <Map
      center={resort.coordinates}
      zoom={13}
      markers={[
        { 
          position: resort.coordinates, 
          type: 'resort',
          title: resort.name 
        },
        ...nearbyAttractions.map(attraction => ({
          position: attraction.coordinates,
          type: 'attraction',
          title: attraction.name,
          onClick: () => handleAttractionClick(attraction)
        }))
      ]}
    />
  </div>

  {/* Address & Actions */}
  <div className="flex flex-wrap items-center gap-4">
    <div className="flex items-start gap-2 flex-1">
      <span className="text-xl">📍</span>
      <div>
        <div className="font-medium">{resort.address}</div>
        <div className="text-sm text-gray-600">{resort.city}, {resort.state}</div>
      </div>
    </div>
    <div className="flex gap-2">
      <button className="border px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
        Get Directions
      </button>
      <button className="border px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
        Share Location
      </button>
    </div>
  </div>

  {/* Nearby Attractions */}
  <div>
    <h3 className="text-xl font-semibold mb-4">🎯 Nearby Attractions (Within 5 km)</h3>
    
    {/* Mobile: Stacked cards */}
    <div className="lg:hidden space-y-3">
      {nearbyAttractions.map(attraction => (
        <div key={attraction.id} className="border rounded-lg p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-start gap-2">
              <span className="text-2xl">{attraction.icon}</span>
              <div>
                <h4 className="font-medium">{attraction.name}</h4>
                <p className="text-sm text-gray-600">{attraction.distance} km away</p>
                <p className="text-xs text-gray-500">Perfect for: {attraction.category}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            {attraction.bookable && (
              <a 
                href={`/destinations/${attraction.slug}`}
                className="flex-1 bg-primary text-white text-center py-2 rounded text-sm font-medium"
              >
                Book {attraction.type}
              </a>
            )}
            <button className="flex-1 border py-2 rounded text-sm font-medium">
              Get Directions →
            </button>
          </div>
        </div>
      ))}
    </div>

    {/* Desktop: Grid cards */}
    <div className="hidden lg:grid lg:grid-cols-2 gap-4">
      {nearbyAttractions.map(attraction => (
        <div key={attraction.id} className="border rounded-lg p-4 hover:shadow-md transition">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-3xl">{attraction.icon}</span>
            <div className="flex-1">
              <h4 className="font-semibold text-lg">{attraction.name}</h4>
              <p className="text-sm text-gray-600">{attraction.distance} km away</p>
              <p className="text-xs text-gray-500">Perfect for: {attraction.category}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {attraction.bookable && (
              <a 
                href={`/destinations/${attraction.slug}`}
                className="flex-1 bg-primary text-white text-center py-2 rounded text-sm font-medium hover:bg-primary-dark"
              >
                Book {attraction.type} →
              </a>
            )}
            <button className="flex-1 border py-2 rounded text-sm font-medium hover:bg-gray-50">
              Get Directions
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* Transportation Info */}
  <div className="border-t pt-6">
    <h3 className="font-semibold mb-3">🚗 Transportation</h3>
    <div className="grid md:grid-cols-2 gap-3 text-sm">
      <div className="flex items-start gap-2">
        <span className="text-gray-600">Airport:</span>
        <span>Calicut Airport - 95 km (2 hrs)</span>
      </div>
      <div className="flex items-start gap-2">
        <span className="text-gray-600">Town Center:</span>
        <span>Kalpetta - 12 km (25 min)</span>
      </div>
      <div className="flex items-start gap-2">
        <span className="text-gray-600">Bus Stop:</span>
        <span>2 km away</span>
      </div>
      <div className="flex items-start gap-2">
        <span className="text-gray-600">Train Station:</span>
        <span>Kozhikode - 98 km</span>
      </div>
    </div>
  </div>
</section>
```

---

### 7. Reviews Section (Simplified)

```jsx
<section className="space-y-6">
  <div className="flex items-center justify-between">
    <h2 className="text-2xl font-bold">Guest Reviews</h2>
    <div className="text-right">
      <div className="text-3xl font-bold">⭐ {resort.rating}</div>
      <div className="text-sm text-gray-600">({resort.reviewCount} reviews)</div>
    </div>
  </div>

  {/* Review List */}
  <div className="space-y-4">
    {reviews.slice(0, 3).map(review => (
      <div key={review.id} className="border rounded-lg p-4">
        {/* Reviewer Info */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold">
            {review.user.initials}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{review.user.name}</div>
                <div className="text-sm text-gray-600">
                  {review.user.location} • {review.timeAgo}
                </div>
                {review.roomType && (
                  <div className="text-xs text-gray-500">
                    {review.roomType} • {review.nights} nights
                  </div>
                )}
              </div>
              <div className="text-yellow-500">
                {'⭐'.repeat(review.rating)}
              </div>
            </div>
          </div>
        </div>

        {/* Review Content */}
        <p className="text-gray-700 mb-3">{review.content}</p>

        {/* Review Actions */}
        <div className="flex items-center gap-4 text-sm">
          <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
            <span>👍</span>
            <span>Helpful ({review.helpfulCount})</span>
          </button>
          <button className="text-gray-600 hover:text-gray-900">
            💬 Reply
          </button>
        </div>

        {/* Property Response (if exists) */}
        {review.response && (
          <div className="mt-4 ml-10 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-900 mb-1">
              Response from {resort.name}
            </div>
            <p className="text-sm text-gray-700">{review.response}</p>
          </div>
        )}
      </div>
    ))}
  </div>

  {/* View More Button */}
  <button className="w-full border py-3 rounded-lg font-medium hover:bg-gray-50">
    View All {resort.reviewCount} Reviews →
  </button>
</section>
```

---

### 8. Policies Section

```jsx
<section className="space-y-6">
  <h2 className="text-2xl font-bold">Policies & Important Information</h2>

  {/* Desktop: Grid Layout */}
  <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
    {/* Check-in/out */}
    <div className="border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">🕐</span>
        <h3 className="font-semibold">Check-in & Check-out</h3>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Check-in:</span>
          <span className="font-medium">2:00 PM - 8:00 PM</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Check-out:</span>
          <span className="font-medium">11:00 AM</span>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          • Early check-in: Available (₹1000)
          <br />
          • Late checkout: Till 2 PM (₹1500)
        </div>
      </div>
    </div>

    {/* Cancellation */}
    <div className="border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">❌</span>
        <h3 className="font-semibold">Cancellation Policy</h3>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex items-start gap-2 text-green-600">
          <span>✓</span>
          <span>Free cancellation until 3 days before check-in</span>
        </div>
        <div className="flex items-start gap-2 text-gray-700">
          <span>•</span>
          <span>50% refund: 1-3 days before</span>
        </div>
        <div className="flex items-start gap-2 text-gray-700">
          <span>•</span>
          <span>No refund: Less than 24 hours</span>
        </div>
        <button className="text-primary text-xs mt-2 hover:underline">
          View Full Policy →
        </button>
      </div>
    </div>

    {/* Children & Extra Beds */}
    <div className="border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">👶</span>
        <h3 className="font-semibold">Children & Extra Beds</h3>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Children:</span>
          <span className="font-medium">All ages welcome</span>
        </div>
        <div className="space-y-1 text-xs text-gray-700">
          <div>• Child (0-5 yrs): Free with parents</div>
          <div>• Child (6-12 yrs): ₹1500/night</div>
          <div>• Extra bed: ₹2000/night</div>
          <div>• Max 1 extra bed per room</div>
        </div>
      </div>
    </div>

    {/* Pet Policy */}
    <div className="border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">🐕</span>
        <h3 className="font-semibold">Pet Policy</h3>
      </div>
      <div className="text-sm text-red-600 font-medium">
        ❌ Pets not allowed
      </div>
    </div>

    {/* House Rules */}
    <div className="border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">📋</span>
        <h3 className="font-semibold">House Rules</h3>
      </div>
      <ul className="space-y-1 text-sm text-gray-700">
        <li>• No smoking in rooms</li>
        <li>• No parties or events</li>
        <li>• Quiet hours: 10 PM - 7 AM</li>
        <li>• Valid ID required at check-in</li>
        <li>• Damage deposit: ₹5000 (refundable)</li>
      </ul>
    </div>

    {/* Payment */}
    <div className="border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">💳</span>
        <h3 className="font-semibold">Payment</h3>
      </div>
      <div className="space-y-2 text-sm">
        <div className="text-gray-700">
          Accepted: UPI, Cards, Net Banking
        </div>
        <div className="space-y-1 text-xs text-gray-600">
          <div>• Advance: 30% at booking</div>
          <div>• Balance: Pay at property</div>
        </div>
      </div>
    </div>
  </div>

  {/* Mobile: Collapsible Sections */}
  <div className="md:hidden space-y-3">
    {policyItems.map(policy => (
      <details key={policy.id} className="border rounded-lg">
        <summary className="p-4 cursor-pointer font-medium flex items-center gap-2">
          <span className="text-xl">{policy.icon}</span>
          <span>{policy.title}</span>
        </summary>
        <div className="px-4 pb-4 text-sm text-gray-700">
          {policy.content}
        </div>
      </details>
    ))}
  </div>
</section>
```

---

### 9. FAQ Section

```jsx
<section className="space-y-4">
  <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>

  <div className="space-y-3">
    {faqs.map((faq, index) => (
      <details 
        key={faq.id} 
        className="border rounded-lg"
        open={index === 0}
      >
        <summary className="p-4 cursor-pointer font-medium hover:bg-gray-50 flex items-center justify-between">
          <span>{faq.question}</span>
          <span className="text-gray-400">▼</span>
        </summary>
        <div className="px-4 pb-4 text-gray-700">
          {faq.answer}
        </div>
      </details>
    ))}
  </div>
</section>

{/* FAQ Data */}
const faqs = [
  {
    id: 1,
    question: "What are the check-in and check-out times?",
    answer: "Check-in is from 2:00 PM to 8:00 PM. Check-out is at 11:00 AM. Early check-in and late check-out may be available for an additional fee, subject to availability."
  },
  {
    id: 2,
    question: "Is breakfast included in the room rate?",
    answer: "Yes, complimentary breakfast is included for all guests. We serve a buffet breakfast from 7:30 AM to 10:00 AM with both continental and Indian options."
  },
  {
    id: 3,
    question: "Do you have free parking?",
    answer: "Yes, we offer complimentary parking for all guests. Covered parking is available on a first-come, first-served basis."
  },
  {
    id: 4,
    question: "Is WiFi free throughout the property?",
    answer: "Yes, high-speed WiFi is complimentary in all rooms and common areas."
  },
  {
    id: 5,
    question: "Are pets allowed?",
    answer: "Unfortunately, we do not allow pets at our property, with the exception of registered service animals."
  }
];
```

---

### 10. Similar Properties Section

```jsx
<section className="space-y-4">
  <h2 className="text-2xl font-bold">Similar Properties Nearby</h2>

  {/* Mobile: Horizontal Scroll */}
  <div className="lg:hidden overflow-x-auto pb-4">
    <div className="flex gap-4" style={{ width: 'max-content' }}>
      {similarProperties.map(property => (
        <PropertyCardMobile key={property.id} property={property} />
      ))}
    </div>
  </div>

  {/* Desktop: Grid */}
  <div className="hidden lg:grid lg:grid-cols-3 gap-6">
    {similarProperties.map(property => (
      <a 
        key={property.id}
        href={`/resorts/${property.slug}`}
        className="border rounded-lg overflow-hidden hover:shadow-lg transition group"
      >
        <div className="relative h-48">
          <Image 
            src={property.image} 
            fill 
            className="object-cover group-hover:scale-105 transition"
          />
          <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-sm font-medium">
            {property.distance} km
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold mb-1">{property.name}</h3>
          <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
            <span>⭐ {property.rating}</span>
            <span>({property.reviews})</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold">₹{property.price}</span>
            <span className="text-sm text-gray-600">/night</span>
          </div>
        </div>
      </a>
    ))}
  </div>

  <div className="text-center">
    <a 
      href="/resorts" 
      className="inline-block border px-6 py-3 rounded-lg font-medium hover:bg-gray-50"
    >
      View All Resorts →
    </a>
  </div>
</section>
```

---

## 🎨 STYLING & DESIGN TOKENS

```css
/* Color Palette */
--primary: #2563eb; /* Blue for CTAs */
--primary-dark: #1d4ed8;
--secondary: #10b981; /* Green for success/available */
--danger: #ef4444; /* Red for warnings/unavailable */
--warning: #f59e0b; /* Orange for urgency */

/* Spacing */
--spacing-xs: 0.25rem; /* 4px */
--spacing-sm: 0.5rem; /* 8px */
--spacing-md: 1rem; /* 16px */
--spacing-lg: 1.5rem; /* 24px */
--spacing-xl: 2rem; /* 32px */

/* Typography */
--font-heading: 'Inter', system-ui, sans-serif;
--font-body: 'Inter', system-ui, sans-serif;

/* Shadows */
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
--shadow-md: 0 4px 6px rgba(0,0,0,0.1);
--shadow-lg: 0 10px 15px rgba(0,0,0,0.1);

/* Border Radius */
--radius-sm: 0.375rem; /* 6px */
--radius-md: 0.5rem; /* 8px */
--radius-lg: 0.75rem; /* 12px */
--radius-xl: 1rem; /* 16px */
```

---

## 📊 DATA STRUCTURE REQUIREMENTS

```typescript
// Resort/Property Interface
interface Resort {
  id: string;
  slug: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  images: string[];
  rating: number;
  reviewCount: number;
  badges: ('luxury' | 'verified' | 'popular')[];
  
  // Room Types
  roomTypes: RoomType[];
  
  // Amenities
  amenities: AmenityCategory[];
  
  // Policies
  policies: {
    checkIn: string;
    checkOut: string;
    cancellation: string;
    children: string;
    pets: boolean;
    houseRules: string[];
    payment: string[];
  };
  
  // Nearby
  nearbyAttractions: Attraction[];
  transportation: Transportation;
  
  // Reviews
  reviews: Review[];
}

interface RoomType {
  id: string;
  name: string;
  description: string;
  image: string;
  images: string[];
  price: number;
  maxGuests: number;
  bedConfiguration: string;
  size: number; // in sq ft
  highlights: string[];
  amenities: string[];
  available: number; // Number of rooms available
}

interface AmenityCategory {
  name: string;
  icon: string;
  items: string[];
}

interface Attraction {
  id: string;
  slug: string;
  name: string;
  icon: string;
  distance: number; // in km
  category: string;
  type: string; // 'trek', 'waterfall', 'safari', etc.
  bookable: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface Transportation {
  airport: {
    name: string;
    distance: number;
    duration: string;
  };
  trainStation: {
    name: string;
    distance: number;
  };
  busStop: {
    distance: number;
  };
  townCenter: {
    name: string;
    distance: number;
    duration: string;
  };
}

interface Review {
  id: string;
  user: {
    name: string;
    initials: string;
    location: string;
    avatar?: string;
  };
  rating: number;
  content: string;
  timeAgo: string;
  roomType?: string;
  nights?: number;
  helpfulCount: number;
  response?: string;
  verified: boolean;
}
```

---

## 🔧 TECHNICAL IMPLEMENTATION NOTES

### File Structure

```
app/
├── resorts/
│   └── [slug]/
│       ├── page.tsx (Main resort detail page)
│       └── components/
│           ├── HeroGallery.tsx
│           ├── StickyBookingCard.tsx
│           ├── StickyBottomBar.tsx
│           ├── RoomTypesSection.tsx
│           ├── RoomCard.tsx
│           ├── AmenitiesSection.tsx
│           ├── LocationSection.tsx
│           ├── InteractiveMap.tsx
│           ├── NearbyAttractions.tsx
│           ├── ReviewsSection.tsx
│           ├── ReviewCard.tsx
│           ├── PoliciesSection.tsx
│           ├── FAQSection.tsx
│           └── SimilarProperties.tsx
```

### API Endpoints Required

```typescript
// Get resort details
GET /api/resorts/{slug}
Response: Resort object with all nested data

// Get room availability
GET /api/resorts/{id}/rooms/availability?checkIn=2025-01-15&checkOut=2025-01-18
Response: RoomType[] with updated 'available' counts

// Get nearby attractions
GET /api/resorts/{id}/nearby?radius=5
Response: Attraction[]

// Get reviews
GET /api/resorts/{id}/reviews?page=1&limit=10
Response: { reviews: Review[], total: number }

// Mark review helpful
POST /api/reviews/{id}/helpful
Response: { success: boolean, newCount: number }
```

### Next.js Page Implementation

```tsx
// app/resorts/[slug]/page.tsx
import { notFound } from 'next/navigation';
import HeroGallery from './components/HeroGallery';
import StickyBookingCard from './components/StickyBookingCard';
import StickyBottomBar from './components/StickyBottomBar';
import RoomTypesSection from './components/RoomTypesSection';
import AmenitiesSection from './components/AmenitiesSection';
import LocationSection from './components/LocationSection';
import ReviewsSection from './components/ReviewsSection';
import PoliciesSection from './components/PoliciesSection';
import FAQSection from './components/FAQSection';
import SimilarProperties from './components/SimilarProperties';

// Generate static params for all resorts
export async function generateStaticParams() {
  const resorts = await fetch('https://api.wayantrails.com/resorts').then(res => res.json());
  return resorts.map((resort) => ({
    slug: resort.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const resort = await getResortData(params.slug);
  
  return {
    title: `${resort.name} - WayanTrails`,
    description: resort.description,
    openGraph: {
      title: resort.name,
      description: resort.description,
      images: [resort.images[0]],
      type: 'website',
    },
  };
}

async function getResortData(slug: string) {
  const res = await fetch(`https://api.wayantrails.com/resorts/${slug}`, {
    next: { revalidate: 3600 } // Revalidate every hour
  });
  
  if (!res.ok) return null;
  return res.json();
}

export default async function ResortDetailPage({ params }) {
  const resort = await getResortData(params.slug);
  
  if (!resort) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-3 text-sm text-gray-600">
        <a href="/" className="hover:text-primary">Home</a>
        {' > '}
        <a href="/resorts" className="hover:text-primary">Resorts</a>
        {' > '}
        <span className="text-gray-900">{resort.name}</span>
      </div>

      {/* Hero Gallery */}
      <HeroGallery images={resort.images} />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="lg:flex lg:gap-8">
          {/* Left Column - Main Content */}
          <div className="flex-1 space-y-8">
            {/* Header */}
            <div>
              <div className="flex gap-2 mb-2">
                {resort.badges.includes('luxury') && (
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
                    🏆 Luxury
                  </span>
                )}
                {resort.badges.includes('verified') && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                    ✓ Verified
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">{resort.name}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">⭐</span>
                  <span className="font-semibold">{resort.rating}</span>
                  <span>({resort.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>📍</span>
                  <span>{resort.city}, {resort.state}</span>
                </div>
              </div>
              
              <div className="flex gap-3 mt-4">
                <button className="flex items-center gap-1 text-sm font-medium hover:text-primary">
                  ❤️ Save
                </button>
                <button className="flex items-center gap-1 text-sm font-medium hover:text-primary">
                  🔗 Share
                </button>
              </div>
            </div>

            {/* About Section */}
            <section>
              <h2 className="text-2xl font-bold mb-4">About This Resort</h2>
              <p className="text-gray-700 leading-relaxed">{resort.description}</p>
            </section>

            {/* Room Types */}
            <RoomTypesSection 
              resortName={resort.name}
              roomTypes={resort.roomTypes} 
            />

            {/* Amenities */}
            <AmenitiesSection amenities={resort.amenities} />

            {/* Location */}
            <LocationSection 
              resort={resort}
              nearbyAttractions={resort.nearbyAttractions}
              transportation={resort.transportation}
            />

            {/* Reviews */}
            <ReviewsSection 
              resortId={resort.id}
              rating={resort.rating}
              reviewCount={resort.reviewCount}
              reviews={resort.reviews}
            />

            {/* Policies */}
            <PoliciesSection policies={resort.policies} />

            {/* FAQ */}
            <FAQSection resortName={resort.name} />

            {/* Similar Properties */}
            <SimilarProperties 
              currentResortId={resort.id}
              location={resort.city}
            />
          </div>

          {/* Right Column - Sticky Booking Card (Desktop) */}
          <StickyBookingCard 
            resort={resort}
            roomTypes={resort.roomTypes}
          />
        </div>
      </div>

      {/* Sticky Bottom Bar (Mobile) */}
      <StickyBottomBar 
        minPrice={Math.min(...resort.roomTypes.map(r => r.price))}
        resortName={resort.name}
      />
    </div>
  );
}
```

### Responsive Breakpoints

```css
/* Mobile First Approach */

/* Extra Small devices (phones, less than 640px) */
@media (max-width: 639px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

/* Small devices (tablets, 640px and up) */
@media (min-width: 640px) {
  /* Styles for tablets */
}

/* Medium devices (small laptops, 768px and up) */
@media (min-width: 768px) {
  /* Grid changes from 1 to 2 columns */
}

/* Large devices (desktops, 1024px and up) */
@media (min-width: 1024px) {
  /* Sticky booking card appears */
  /* Bottom bar hides */
  /* Grid changes to 3 columns */
}

/* Extra large devices (large desktops, 1280px and up) */
@media (min-width: 1280px) {
  /* Maximum content width */
  .container {
    max-width: 1280px;
  }
}
```

---

## ⚡ PERFORMANCE OPTIMIZATION

### Image Optimization

```tsx
// Use Next.js Image component
import Image from 'next/image';

<Image
  src={resort.image}
  alt={resort.name}
  width={800}
  height={600}
  quality={85}
  priority={index === 0} // Priority for hero image
  placeholder="blur"
  blurDataURL={resort.blurDataURL}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### Lazy Loading Components

```tsx
import dynamic from 'next/dynamic';

// Lazy load map component (not needed immediately)
const InteractiveMap = dynamic(() => import('./components/InteractiveMap'), {
  loading: () => <div className="h-[400px] bg-gray-100 animate-pulse rounded-lg" />,
  ssr: false
});

// Lazy load reviews section
const ReviewsSection = dynamic(() => import('./components/ReviewsSection'), {
  loading: () => <div>Loading reviews...</div>
});
```

### Data Fetching Strategy

```tsx
// Server Component for initial data
async function ResortDetailPage({ params }) {
  // Fetch critical data server-side
  const resort = await getResortData(params.slug);
  
  return (
    <div>
      <HeroGallery images={resort.images} />
      
      {/* Client component for interactive features */}
      <BookingCard resort={resort} />
      
      {/* Suspense boundary for non-critical data */}
      <Suspense fallback={<LoadingSkeleton />}>
        <ReviewsSection resortId={resort.id} />
      </Suspense>
    </div>
  );
}
```

---

## 🎯 USER INTERACTION FLOWS

### Booking Flow

```
1. User lands on resort detail page
   ↓
2. Browses images, amenities, reviews
   ↓
3. Selects dates in sticky card (or clicks bottom bar on mobile)
   ↓
4. Selects number of guests
   ↓
5. Sees available room types with prices
   ↓
6. Clicks "Select Room" on desired room type
   ↓
7. Redirected to booking form page (or modal)
   ↓
8. If not logged in → Authentication required
   ↓
9. Fills booking form with:
   - Check-in/out dates (pre-filled)
   - Room type (pre-selected)
   - Guest details
   - Special requests
   ↓
10. Clicks "Request Booking"
    ↓
11. WhatsApp message pre-filled with all details
    ↓
12. Sent to WayanTrails team
    ↓
13. Team confirms availability and sends payment link
    ↓
14. User pays and receives confirmation
```

### Search & Discovery Flow

```
1. User searches "Wayanad resorts"
   ↓
2. Lands on resort listing page
   ↓
3. Clicks on resort card
   ↓
4. Arrives at resort detail page
   ↓
5. Scrolls through content
   ↓
6. Clicks "Get Directions" to nearby attraction
   ↓
7. Sees attraction is bookable on WayanTrails
   ↓
8. Clicks "Book Trek" → Redirected to destinations page
   ↓
9. Books trek instantly
   ↓
10. Returns to resort page to complete stay booking
```

---

## 📱 MOBILE-SPECIFIC OPTIMIZATIONS

### Touch Interactions

```tsx
// Swipeable gallery
<div 
  className="overflow-x-auto snap-x snap-mandatory"
  style={{ scrollSnapType: 'x mandatory' }}
>
  {images.map(img => (
    <div 
      key={img} 
      className="snap-center"
      style={{ scrollSnapAlign: 'center' }}
    >
      <Image src={img} />
    </div>
  ))}
</div>

// Pull to refresh (optional)
<div 
  onTouchStart={handleTouchStart}
  onTouchMove={handleTouchMove}
  onTouchEnd={handleTouchEnd}
>
  {content}
</div>
```

### Mobile Navigation

```tsx
// Sticky header with back button
<header className="lg:hidden sticky top-0 bg-white border-b z-50 px-4 py-3">
  <div className="flex items-center gap-3">
    <button onClick={() => router.back()}>
      ← Back
    </button>
    <div className="flex-1 truncate font-medium">
      {resort.name}
    </div>
    <button>❤️</button>
    <button>🔗</button>
  </div>
</header>
```

### Collapsible Sections

```tsx
// Automatic collapsing on mobile
<section className="border-t pt-6">
  <button
    className="lg:hidden flex items-center justify-between w-full py-3"
    onClick={() => setExpanded(!expanded)}
  >
    <h2 className="text-xl font-bold">Amenities & Facilities</h2>
    <span className={`transform transition ${expanded ? 'rotate-180' : ''}`}>
      ▼
    </span>
  </button>
  
  <div className={`lg:block ${expanded ? 'block' : 'hidden'}`}>
    {/* Content */}
  </div>
</section>
```

---

## 🔍 SEO OPTIMIZATION

### Structured Data (Schema.org)

```tsx
// Add to page head
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Hotel",
      "name": resort.name,
      "description": resort.description,
      "image": resort.images,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": resort.address,
        "addressLocality": resort.city,
        "addressRegion": resort.state,
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": resort.coordinates.lat,
        "longitude": resort.coordinates.lng
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": resort.rating,
        "reviewCount": resort.reviewCount,
        "bestRating": "5",
        "worstRating": "1"
      },
      "priceRange": `₹${Math.min(...resort.roomTypes.map(r => r.price))} - ₹${Math.max(...resort.roomTypes.map(r => r.price))}`,
      "telephone": resort.phone,
      "amenityFeature": resort.amenities.flatMap(cat => cat.items).map(item => ({
        "@type": "LocationFeatureSpecification",
        "name": item
      }))
    })
  }}
/>
```

### Meta Tags

```tsx
export const metadata = {
  title: `${resort.name} - Luxury Resort in Wayanad | WayanTrails`,
  description: `Book ${resort.name} in ${resort.city}, Wayanad. ${resort.description.slice(0, 150)}...`,
  keywords: `${resort.name}, wayanad resorts, ${resort.city} hotels, kerala resorts, wayanad accommodation`,
  openGraph: {
    title: resort.name,
    description: resort.description,
    images: [resort.images[0]],
    url: `https://wayantrails.com/resorts/${resort.slug}`,
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: resort.name,
    description: resort.description,
    images: [resort.images[0]],
  },
  alternates: {
    canonical: `https://wayantrails.com/resorts/${resort.slug}`,
  },
};
```

---

## ✅ IMPLEMENTATION CHECKLIST

### Phase 1: Core Structure (Week 1)
- [ ] Set up page routing and data fetching
- [ ] Implement hero image gallery with lightbox
- [ ] Create responsive layout (mobile/desktop)
- [ ] Build sticky booking card (desktop)
- [ ] Build sticky bottom bar (mobile)
- [ ] Implement breadcrumb navigation

### Phase 2: Content Sections (Week 2)
- [ ] Room types section with cards
- [ ] Amenities categorized layout
- [ ] Location section with map integration
- [ ] Reviews section (simplified)
- [ ] Policies section
- [ ] FAQ section

### Phase 3: Interactivity (Week 3)
- [ ] Date picker integration
- [ ] Guest selector
- [ ] Room type selector
- [ ] Price calculator
- [ ] Collapsible sections (mobile)
- [ ] Image gallery swipe (mobile)

### Phase 4: Polish & Optimization (Week 4)
- [ ] Image optimization
- [ ] Lazy loading
- [ ] SEO metadata
- [ ] Structured data
- [ ] Performance testing
- [ ] Mobile testing
- [ ] Cross-browser testing

---

## 🎉 FINAL NOTES FOR CLAUDE CODE

This document provides everything needed to implement a world-class resort detail page:

✅ **Complete mobile and desktop layouts** with ASCII mockups
✅ **Detailed component specifications** with actual code
✅ **Data structure requirements** with TypeScript interfaces
✅ **Implementation examples** for all major features
✅ **Performance optimization** strategies
✅ **SEO best practices** with schema markup
✅ **User flow documentation** for context
✅ **Phase-by-phase checklist** for organized development

**Key Principles:**
- Mobile-first responsive design
- Progressive enhancement
- Performance optimized
- SEO friendly
- User-centric UX
- Accessibility compliant

**Start with:** Hero gallery, sticky booking card, and room types section. These are the core conversion drivers!