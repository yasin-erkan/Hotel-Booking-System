import express from 'express';
import {protect} from '../middleware/authMiddleware.js';
import {registerHotel} from '../controllers/hotelController.js';

export const hotelRouter = express.Router();

hotelRouter.post('/', protect, registerHotel);
