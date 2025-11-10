import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './configs/db.js';
import {clerkMiddleware} from '@clerk/express';
import clerkWebhooks from './controllers/clerkWebHooks.js';

dotenv.config();

connectDB().catch((err) => {
  console.error('MongoDB connection error:', err.message);
});

const app = express();
app.use(cors());
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(clerkMiddleware());

app.post('/api/clerk', express.raw({type: 'application/json'}), (req, res, next) => {
  req.rawBody = req.body;
  next();
}, clerkWebhooks);

app.get('/', (req, res) => res.send('API is working'));
app.get('/api/index', (req, res) => res.send('API is working'));

const PORT = process.env.PORT || 3000;

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
