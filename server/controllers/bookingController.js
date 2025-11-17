import Booking from '../models/Booking.js';
import Room from '../models/Room.js';
import Hotel from '../models/Hotel.js';

// Utility function: Check existing bookings in database
export const checkAvailability = async ({checkInDate, checkOutDate, room}) => {
  try {
    const bookings = await Booking.find({
      checkInDate: {$lte: checkOutDate},
      checkOutDate: {$gte: checkInDate},
      room,
    });
    const isAvailable = bookings.length === 0;
    return isAvailable;
  } catch (error) {
    console.error('Availability check error:', error.message);
    throw error;
  }
};

// ! API endpoint: Handle request from frontend and call checkAvailability
// ! POST /api/bookings/check-availability
export const checkAvailabilityAPI = async (req, res) => {
  try {
    const {room, checkInDate, checkOutDate} = req.body;
    const isAvailable = await checkAvailability({
      room,
      checkInDate,
      checkOutDate,
    });
    res.json({success: true, isAvailable});
  } catch (error) {
    res.json({success: false, message: error.message});
  }
};

// API to create booking => POST/api/bookings/book

export const createBooking = async (req, res) => {
  try {
    // first reach info and user on the body of request coming from client side
    const {room, checkInDate, checkOutDate, guests} = req.body;

    //  check availability
    const isAvailable = await checkAvailability({
      room,
      checkInDate,
      checkOutDate,
    });
    if (!isAvailable) {
      return res.json({
        success: false,
        message: 'Room is not available for selected dates',
      });
    }

    // get the total price for room and then calculate the price
    const roomData = await Room.findById(room).populate('hotel');
    if (!roomData) {
      return res.json({success: false, message: 'Room not found'});
    }

    let totalPrice = roomData.pricePerNight;
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    totalPrice *= nights;

    const booking = await Booking.create({
      user: req.user._id,
      room,
      hotel: roomData.hotel._id,
      guests: +guests,
      checkInDate,
      checkOutDate,
      totalPrice,
    });
    res.json({success: true, message: 'Booking created '});
  } catch (error) {
    res.json({success: false, message: 'failed to create Booking  '});
  }
};

// API to get all bookings for a particular user => GET /api/bookings/user
export const getUserBookings = async (req, res) => {
  try {
    const user = req.user._id;
    const bookings = await Booking.find({user})
      .populate('hotel room')
      .sort({createdAt: -1});
    res.json({success: true, bookings});
  } catch (error) {
    res.json({success: false, message: 'failed to fetch bookings '});
  }
};

export const getHotelBookings = async (req, res) => {
  try {
    const auth = await req.auth();
    const hotel = await Hotel.findOne({owner: auth.userId});
    if (!hotel) {
      return res.json({success: true, message: 'No Hotel found'});
    }
    const bookings = await Booking.find({hotel: hotel._id})
      .populate('room hotel user')
      .sort({createdAt: -1});
    // total bookings
    const totalBookings = bookings.length;
    //total revenue
    const totalRevenue = bookings.reduce(
      (acc, booking) => acc + booking.totalPrice,
      0,
    );
    res.json({
      success: true,
      dashboardData: {totalBookings, totalRevenue, bookings},
    });
  } catch (error) {
    res.json({success: false, message: 'Failed to fetch bookings'});
  }
};
