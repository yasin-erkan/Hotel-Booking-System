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

//middleware
app.use(express.json());
app.use(clerkMiddleware());

//API to listenClerk Webhook
app.use('/api/clerk', clerkWebhooks);

const HEALTH_MESSAGE = 'API is working perfectly';

app.get('/', (req, res) => res.send(HEALTH_MESSAGE));
app.get('/api/index', (req, res) => res.send(HEALTH_MESSAGE));

const PORT = process.env.PORT || 3000;

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}

export default app;
