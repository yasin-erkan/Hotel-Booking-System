import Hotel from '../models/Hotel.js';
import User from '../models/User.js';

export const registerHotel = async (req, res) => {
  try {
    const {name, address, contact, city} = req.body;
    const owner = req.body._id;

    //check if User already registered
    const hotel = await Hotel.findOne({owner});
    if (hotel) {
      return res.json({
        success: false,
        message: 'Hotel has already been registered!',
      });
      await Hotel.create({name, address, contact, city, owner});
      await User.findByIdAndUpdate(owner, {role: 'hotelOwner'});
      res.json({success: true, message: 'Hotel  registered successfully!'});
    }
  } catch (error) {
    registerHotel.json({
      success: true,
      message: error.message,
    });
  }
};
