# 🏨 Hotel Booking System

Full-stack hotel booking application built with MERN stack featuring admin dashboard for managing hotels, rooms, and bookings.

## 🛠️ Tech Stack

**Frontend:** React 19.1, React Router, TailwindCSS 4.1, Vite  
**Backend:** Node.js, Express.js, MongoDB, Mongoose, Clerk Authentication

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
    ├── controllers/      # Business logic
    ├── middleware/      # Auth & upload middleware
    ├── models/           # MongoDB schemas
    ├── routes/           # API routes
    └── server.js         # Express app entry point
```

## 🎯 Implementation Status

### ✅ Completed (Frontend)

- [x] Vite + React 19 setup with Tailwind 4
- [x] Global theming, typography, spacing tokens
- [x] End-to-end responsive marketing pages
- [x] Auth flows wired to Clerk components
- [x] Owner dashboard analytics + bookings table
- [x] Owner Add Room media form + amenities builder
- [x] Owner List Room grid/table hybrid with filters
- [x] Shared layout: sticky navbar, glass sidebar, contextual footer

### ✅ Completed (Backend)

- [x] Express server setup with Vercel serverless support
- [x] MongoDB connection with Mongoose
- [x] Clerk webhook integration for user sync
- [x] User authentication middleware
- [x] REST API endpoints (User, Hotel, Room)
- [x] Cloudinary integration for image uploads
- [x] MongoDB models (User, Hotel, Room)

### 🚧 In Progress

- [ ] Booking confirmation flow wiring to backend
- [ ] Payment integration
- [ ] Email notifications

### 📋 To Do

- [ ] Booking model and endpoints
- [ ] Search and filter functionality
- [ ] Admin dashboard backend integration
- [ ] Real-time booking updates

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

**Backend (.env in server/)**

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net
MONGODB_DB=Hoteluxe
CLERK_WEBHOOK_SECRET_KEY=whsec_...
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Frontend (.env in client/)**

```env
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

### Clerk Webhook

- `POST /api/clerk` - Clerk webhook for user sync

## 🚢 Deployment

### Vercel

Backend and frontend are deployed separately on Vercel:

- Backend: Uses `server/vercel.json` configuration
- Frontend: Uses `client/vercel.json` configuration

Make sure to set all environment variables in Vercel dashboard.

⭐ Star this repo if you find it helpful!
