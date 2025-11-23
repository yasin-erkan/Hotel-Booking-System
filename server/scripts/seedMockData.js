import connectDB from '../configs/db.js';
import Hotel from '../models/Hotel.js';
import Room from '../models/Room.js';
import dotenv from 'dotenv';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({path: path.resolve(__dirname, '..', '.env')});
dotenv.config({path: path.resolve(__dirname, '..', '..', '.env')});

// Mock data from assets.js
// Update this with your actual Clerk User ID
const ownerId = process.env.SEED_OWNER_ID || 'user_35IlQNxUGYLezuK0FJrvbN7kztc';

const hotelData = {
  name: 'Urbanza Suites',
  address: 'Main Road  123 Street , 23 Colony',
  contact: '+0123456789',
  city: 'New York',
};

// Convert Title Case amenities to camelCase
const convertAmenityToCamelCase = amenity => {
  const map = {
    'Free WiFi': 'freeWifi',
    'Free Breakfast': 'freeBreakfast',
    'Room Service': 'roomService',
    'Mountain View': 'mountainView',
    'Pool Access': 'poolAccess',
  };
  return map[amenity] || amenity.toLowerCase().replace(/\s+/g, '');
};

const roomsData = [
  {
    roomType: 'Double Bed',
    pricePerNight: 399,
    amenities: ['roomService', 'mountainView', 'poolAccess'],
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800',
    ],
    isAvailable: true,
  },
  {
    roomType: 'Double Bed',
    pricePerNight: 299,
    amenities: ['roomService', 'mountainView', 'poolAccess'],
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
    ],
    isAvailable: true,
  },
  {
    roomType: 'Double Bed',
    pricePerNight: 249,
    amenities: ['freeWifi', 'freeBreakfast', 'roomService'],
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',
    ],
    isAvailable: true,
  },
  {
    roomType: 'Single Bed',
    pricePerNight: 199,
    amenities: ['freeWifi', 'roomService', 'poolAccess'],
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
    ],
    isAvailable: true,
  },
];

async function seedMockData() {
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB');

    if (!ownerId) {
      throw new Error('SEED_OWNER_ID environment variable is required');
    }

    // Check if hotel already exists
    let hotel = await Hotel.findOne({owner: ownerId});

    if (hotel) {
      console.log('📝 Hotel already exists, updating...');
      hotel.name = hotelData.name;
      hotel.address = hotelData.address;
      hotel.contact = hotelData.contact;
      hotel.city = hotelData.city;
      await hotel.save();
      console.log(`✅ Hotel updated: ${hotel.name}`);
    } else {
      // Create hotel
      hotel = await Hotel.create({
        ...hotelData,
        owner: ownerId,
      });
      console.log(`✅ Hotel created: ${hotel.name}`);
    }

    // Delete existing rooms for this hotel (to avoid duplicates)
    const deletedCount = await Room.deleteMany({hotel: hotel._id});
    console.log(`🗑️  Deleted ${deletedCount.deletedCount} existing rooms`);

    // Create rooms
    const createdRooms = await Room.insertMany(
      roomsData.map(room => ({
        ...room,
        hotel: hotel._id,
      })),
    );
    console.log(`✅ Created ${createdRooms.length} rooms`);

    console.log('\n🎉 Seed data inserted successfully!');
    console.log(`📍 Hotel ID: ${hotel._id}`);
    console.log(`🏨 Hotel Name: ${hotel.name}`);
    console.log(`🏠 City: ${hotel.city}`);
    console.log(`\n📋 Room IDs:`);
    createdRooms.forEach((room, index) => {
      console.log(
        `   ${index + 1}. ${room.roomType} - $${room.pricePerNight}/night (ID: ${room._id})`,
      );
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedMockData();

