import upload from '../middleware/uploadMiddleware.js';
import Hotel from '../models/Hotel.js';
import Room from '../models/Room.js';

// API to create a new room for a hotel
export const createRoom = async (req, res) => {
  try {
    const {roomType, pricePerNight, amenities} = req.body;
    const hotel = await Hotel.find({owner: req.auth.userId});

    if (!hotel) return res.json({success: false, message: 'No Hotel found'});

    //upload image to cloudinary
    const uploadImages = req.files.map(async file => {
      const response = await cloudinary.uploader.upload(file.path);
      return response.secure_url;
    });

    //wait for all uploads to complete
    const images = await Promise.all(uploadImages);

    await Room.create({
      hotel: hotel._id,
      roomType,
      pricePerNight: +pricePerNight,
      amenities: JSON.parse(amenities),
      images,
    });
    res.json({success: true, message: 'Room created successfully'});
  } catch (error) {
    res.json({success: false, message: error.message});
  }
};

// API to create all rooms
export const getRooms = async (req, res) => {
  try {
  } catch (error) {}
};

//API to get All rooms for a definite hotel
export const getOwnerRooms = async (req, res) => {
  try {
  } catch (error) {}
};

//API to toggle availability of a definite room
export const toggleRoomAvailability = async (req, res) => {
  try {
  } catch (error) {}
};
