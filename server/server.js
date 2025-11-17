import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import {fileURLToPath} from 'url';
import connectDB from './configs/db.js';
import {clerkMiddleware} from '@clerk/express';
import clerkWebhooks from './controllers/clerkWebHooks.js';
import userRouter from './routes/userRoutes.js';
import hotelRouter from './routes/hotelRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import roomRouter from './routes/roomRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({path: path.resolve(__dirname, '.env')});
dotenv.config({path: path.resolve(__dirname, '..', '.env')});

connectDB().catch(err => {
  console.error('MongoDB connection error:', err.message);
});
connectCloudinary();

const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

if (!CLERK_SECRET_KEY) {
  console.error('CLERK_SECRET_KEY environment variable is missing');
}

const app = express();
app.use(cors());
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  }),
);
// Clerk Express middleware - pass secretKey explicitly
app.use(
  clerkMiddleware({
    secretKey: CLERK_SECRET_KEY,
  }),
);

app.post(
  '/api/clerk',
  express.raw({type: 'application/json'}),
  (req, res, next) => {
    req.rawBody = req.body;
    next();
  },
  clerkWebhooks,
);

app.get('/', (req, res) => res.send('API is working'));
app.get('/api/index', (req, res) => res.send('API is working'));
app.use('/api/user', userRouter);
app.use('/api/hotels', hotelRouter);
app.use('/api/rooms/', roomRouter);
app.use('/api/bookings/', bookingRouter);

const PORT = process.env.PORT || 3000;

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
