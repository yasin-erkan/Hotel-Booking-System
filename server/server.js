import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './configs/db.js';
import {clerkMiddleware} from '@clerk/express';
import clerkWebhooks from './controllers/clerkWebHooks.js';

dotenv.config();

connectDB();

const app = express();
app.use(cors());

// middleware
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(clerkMiddleware());

// Clerk webhook must receive raw body for signature verification
app.post('/api/clerk', express.raw({type: 'application/json'}), (req, res, next) => {
  req.rawBody = req.body;
  next();
}, clerkWebhooks);

const HEALTH_MESSAGE = 'API is working perfectly';

app.get('/', (req, res) => res.send(HEALTH_MESSAGE));
app.get('/api/index', (req, res) => res.send(HEALTH_MESSAGE));

const PORT = process.env.PORT || 3000;

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}

export default app;
