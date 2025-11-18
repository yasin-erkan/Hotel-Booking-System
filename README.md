# 🏨 Hotel Booking System

Full-stack hotel booking application built with MERN stack featuring admin dashboard for managing hotels, rooms, and bookings.

## 🛠️ Tech Stack

**Frontend:** React 19.1, React Router, TailwindCSS 4.1, Vite, React Hot Toast  
**Backend:** Node.js, Express.js, MongoDB, Mongoose, Clerk Authentication, Cloudinary

## ✨ Features

### User Side

- 🔍 Search hotels by destination, dates, and guests
- 🏨 Browse hotels and rooms with detailed info
- 💳 Secure booking system UI flows
- 👤 User authentication (Clerk)
- 📱 Fully responsive design across desktop, tablet, mobile

### Admin Dashboard

- 📊 Dashboard with revenue + booking analytics
- 🏢 Add / edit / list rooms with media uploads
- 📋 Booking tracking table with status toggles
- 💰 Pricing chips, inventory badges, actionable CTAs
- 🧭 Owner console layout with sticky navbar + glass sidebar

## 📸 Screenshots

<p align="center">
  <img src="./client/public/home-min.png" alt="Homepage view" width="280" />
  <img src="./client/public/destinations-min.png" alt="Destinations list" width="280" />
  <img src="./client/public/detail-min.png" alt="Room detail" width="280" />
</p>
<p align="center">
  <img src="./client/public/rooms-min.png" alt="Rooms overview" width="280" />
  <img src="./client/public/roomList-min.png" alt="Room list management" width="280" />
  <img src="./client/public/dashboard-min.png" alt="Owner analytics dashboard" width="280" />
</p>
<p align="center">
  <img src="./client/public/admin-min.png" alt="Owner console navigation" width="280" />
  <img src="./client/public/mobil-min.png" alt="Mobile layout" width="280" />
  <img src="./client/public/reg-min.png" alt="User registration" width="280" />
</p>

## 📁 Project Structure

```
hotel-booking/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Navbar, Hero, etc.
│   │   ├── pages/       # Home, Hotels, etc.
│   │   └── assets/      # Images & icons
└── server/              # Express backend
    ├── configs/         # Database & Cloudinary config
    ├── controllers/     # Business logic (user, hotel, room, booking)
    ├── middleware/      # Auth & upload middleware
    ├── models/          # MongoDB schemas (User, Hotel, Room, Booking)
    ├── routes/          # API routes (user, hotel, room, booking)
    └── server.js        # Express app entry point
```

## 🎯 Implementation Status

### ✅ Completed (Frontend)

- [x] Vite + React 19 setup with Tailwind 4
- [x] Global theming, typography, spacing tokens
- [x] End-to-end responsive marketing pages
- [x] Auth flows wired to Clerk components
- [x] Owner dashboard analytics + bookings table with real-time API integration
- [x] Owner Add Room media form + amenities builder
- [x] Owner List Room grid/table hybrid with filters
- [x] Shared layout: sticky navbar, glass sidebar, contextual footer
- [x] Dashboard data fetching with useMemo optimization
- [x] Recent bookings display with formatted dates and status
- [x] Revenue and booking statistics cards
- [x] Room filtering by type (Single Bed, Double Bed, Luxury Bed, Family Suite)
- [x] Price range filtering with dynamic range selection
- [x] Sort functionality (Price Low to High, Price High to Low, Newest First)
- [x] Destination-based filtering from URL search params
- [x] Filter state management with clear filters functionality

### ✅ Completed (Backend)

- [x] Express server setup with Vercel serverless support
- [x] MongoDB connection with Mongoose
- [x] Clerk webhook integration for user sync
- [x] User authentication middleware
- [x] REST API endpoints (User, Hotel, Room, Booking)
- [x] Cloudinary integration for image uploads
- [x] MongoDB models (User, Hotel, Room, Booking)
- [x] Booking availability checking
- [x] Booking creation with price calculation
- [x] User bookings retrieval
- [x] Hotel owner bookings dashboard with revenue analytics

### 🚧 In Progress

- [ ] Payment integration
- [ ] Email notifications
- [ ] Real-time booking updates

### 📋 To Do

- [ ] Booking cancellation endpoint
- [ ] Booking status update endpoint
- [ ] Advanced search and filter functionality
- [ ] Email notifications for bookings

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- MongoDB Atlas account
- Clerk account (for authentication)
- Cloudinary account (for image uploads)

### Installation

1. Clone the repository

```bash
git clone https://github.com/yasin-erkan/Hotel-Booking-System.git
cd Hotel-Booking-System
```

2. Install dependencies

```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

3. Environment Variables

**Backend (.env in `server/`)**

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net
MONGODB_DB=Hoteluxe
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET_KEY=whsec_...
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Frontend (.env in `client/`)**

```env
VITE_BACKEND_URL=http://localhost:3000
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

4. Run the application

```bash
# Backend (from server/)
npm run dev

# Frontend (from client/)
npm run dev
```

## 📡 API Endpoints

### User Routes (`/api/user`)

- `GET /api/user` - Get user data (protected)
- `POST /api/user/store-recent-search` - Store recent searched cities (protected)

### Hotel Routes (`/api/hotels`)

- `POST /api/hotels` - Register new hotel (protected)

### Room Routes (`/api/rooms`)

- `GET /api/rooms` - Get all available rooms (public)
- `POST /api/rooms` - Create new room (protected, owner only)
- `GET /api/rooms/owner` - Get all rooms for owner's hotel (protected)
- `POST /api/rooms/toggle-availability` - Toggle room availability (protected)

### Booking Routes (`/api/bookings`)

- `POST /api/bookings/check-availability` - Check room availability
- `POST /api/bookings/book` - Create new booking (protected)
- `GET /api/bookings/user` - Get user's bookings (protected)
- `GET /api/bookings/hotel` - Get hotel bookings with analytics (protected, owner only)

### Clerk Webhook

- `POST /api/clerk` - Clerk webhook for user sync

## 🔄 Recent Updates

### Latest Changes

- **Search & Filter System**: Implemented comprehensive room filtering with room type, price range, and destination filters
- **Sort Functionality**: Added sorting by price (low to high, high to low) and newest first
- **Filter State Management**: Built robust filter state management with clear filters functionality
- **Room Type Matching**: Fixed room type matching logic with normalization for case-insensitive comparison
- **Dashboard Integration**: Connected Dashboard component to real API endpoints (`/api/bookings/hotel`) for live data
- **Performance Optimization**: Implemented `useMemo` hooks for filtered rooms and other computed values
- **Data Formatting**: Added date formatting and status normalization utilities for booking display
- **Import Path Fixes**: Standardized all AppContext imports to use extensionless paths for better Vite compatibility
- **Vite Configuration**: Added resolve extensions (`.js`, `.jsx`, `.json`) to vite.config.js
- **Syntax Fixes**: Fixed conditional rendering syntax in FeaturedDestination component

### Technical Improvements

- Replaced dummy data with real API calls in Dashboard
- Added proper error handling for API requests
- Implemented currency support from AppContext
- Fixed React hooks dependencies and imports
- Added room filtering with normalized type matching (handles "double" vs "Double Bed")
- Implemented URL search params integration for destination filtering

## 🧪 Troubleshooting

- **`POST /api/hotels` returns 404** – ensure you are signed in via Clerk before opening the registration modal. The request passes through `protect`, which looks up the Clerk `userId` in MongoDB. Run the Clerk webhook locally (`/api/clerk`) or manually seed the user so it exists in Mongo before calling the route.
- **Frontend can't reach the API** – confirm `VITE_BACKEND_URL` is set and Vite was restarted after editing `.env`. Axios pulls its base URL at import time.
- **Signature verification fails** – double-check both `CLERK_SECRET_KEY` (for middleware) and `CLERK_WEBHOOK_SECRET_KEY` (for Svix) are set in your backend environment.
- **Import resolution errors** – if Vite can't resolve imports, clear the cache with `rm -rf node_modules/.vite` and restart the dev server. Ensure all imports use extensionless paths (e.g., `'../../context/AppContext'` not `'../../context/AppContext.jsx'`).

## 🚢 Deployment

### Vercel

Backend and frontend are deployed separately on Vercel:

- Backend: Uses `server/vercel.json` configuration
- Frontend: Uses `client/vercel.json` configuration

Make sure to set all environment variables in Vercel dashboard.

⭐ Star this repo if you find it helpful!
