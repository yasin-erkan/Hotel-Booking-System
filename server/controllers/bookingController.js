import Booking from '../models/Booking.js';
import Room from '../models/Room.js';
import Hotel from '../models/Hotel.js';
import transporter from '../configs/nodeMailer.js';

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
    const {room, checkInDate, checkOutDate, guests, userEmail} = req.body;

    // Use email from frontend (Clerk) if provided, otherwise check user model
    const recipientEmail =
      userEmail && !userEmail.includes('@clerk.local')
        ? userEmail
        : req.user.email && !req.user.email.includes('@clerk.local')
        ? req.user.email
        : null;

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
      user: req.user._id.toString(),
      room: room.toString(),
      hotel: roomData.hotel._id.toString(),
      guests: +guests,
      checkInDate,
      checkOutDate,
      totalPrice,
    });

    // Send email notification (non-blocking)
    if (
      recipientEmail &&
      !recipientEmail.includes('@clerk.local') &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
    ) {
      try {
        const mailOptions = {
          from: process.env.SENDER_EMAIL || process.env.SMTP_USER,
          to: recipientEmail,
          subject: 'Hotel Booking Confirmation',
          html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Your Booking Confirmation</h2>
            <p>Dear ${req.user.username || 'Guest'},</p>
            <p>Thank you for your booking! Here are your booking details:</p>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <ul style="list-style: none; padding: 0;">
                <li style="margin: 10px 0;"><strong>Booking ID:</strong> ${
                  booking._id
                }</li>
                <li style="margin: 10px 0;"><strong>Hotel Name:</strong> ${
                  roomData.hotel.name
                }</li>
                <li style="margin: 10px 0;"><strong>Location:</strong> ${
                  roomData.hotel.address
                }</li>
                <li style="margin: 10px 0;"><strong>Room Type:</strong> ${
                  roomData.roomType
                }</li>
                <li style="margin: 10px 0;"><strong>Check-In:</strong> ${new Date(
                  checkInDate,
                ).toLocaleDateString()}</li>
                <li style="margin: 10px 0;"><strong>Check-Out:</strong> ${new Date(
                  checkOutDate,
                ).toLocaleDateString()}</li>
                <li style="margin: 10px 0;"><strong>Guests:</strong> ${guests}</li>
                <li style="margin: 10px 0;"><strong>Total Amount:</strong> ${
                  process.env.CURRENCY || '$'
                }${booking.totalPrice}</li>
              </ul>
            </div>
            <p>We look forward to welcoming you!</p>
            <p>If you need to make changes, feel free to contact us.</p>
            <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">This is an automated email. Please do not reply.</p>
          </div>
          `,
        };
        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        // Email error shouldn't prevent booking creation
      }
    }

    res.json({success: true, message: 'Booking created successfully'});
  } catch (error) {
    res.json({
      success: false,
      message: error.message || 'Failed to create booking',
    });
  }
};

// API to get all bookings for a particular user => GET /api/bookings/user
export const getUserBookings = async (req, res) => {
  try {
    const user = req.user._id.toString();
    const bookings = await Booking.find({user})
      .populate('hotel room')
      .sort({createdAt: -1});
    res.json({success: true, bookings});
  } catch (error) {
    res.json({
      success: false,
      message: error.message || 'failed to fetch bookings',
    });
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
