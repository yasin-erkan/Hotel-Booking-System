import User from '../models/User.js';
import {Webhook} from 'svix';
import {ensureConnection} from '../configs/db.js';
import mongoose from 'mongoose';

// Version marker to verify deployed code
const WEBHOOK_VERSION = 'v2.0.0-no-email-validation';

const clerkWebhooks = async (req, res) => {
  try {
    console.log(`[${WEBHOOK_VERSION}] Clerk webhook handler started`);

    if (req.method !== 'POST') {
      return res
        .status(405)
        .json({success: false, message: 'Method Not Allowed'});
    }

    if (!process.env.CLERK_WEBHOOK_SECRET_KEY) {
      throw new Error('CLERK_WEBHOOK_SECRET_KEY env var missing');
    }

    // svix instance with clerk webhook secret
    const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET_KEY);

    //getting headers
    const headers = {
      'svix-id': req.headers['svix-id'],
      'svix-timestamp': req.headers['svix-timestamp'],
      'svix-signature': req.headers['svix-signature'],
    };

    if (
      !headers['svix-id'] ||
      !headers['svix-timestamp'] ||
      !headers['svix-signature']
    ) {
      return res.status(400).json({
        success: false,
        message: 'Missing Svix signature headers',
      });
    }

    //verifying headers
    const payloadBuffer = Buffer.isBuffer(req.rawBody)
      ? req.rawBody
      : Buffer.isBuffer(req.body)
      ? req.body
      : Buffer.from(
          typeof req.body === 'string' ? req.body : JSON.stringify(req.body),
        );
    const event = await webhook.verify(payloadBuffer, headers);

    // getting data from request body
    const {data, type} = event;

    console.log(`[${WEBHOOK_VERSION}] Received Clerk webhook event: ${type}`, {
      userId: data?.id,
      hasEmail: !!data?.email_addresses?.[0]?.email_address,
      emailAddresses: data?.email_addresses?.length || 0,
    });

    // CRITICAL: This version does NOT validate email - it always uses fallback
    console.log(
      `[${WEBHOOK_VERSION}] Email validation is DISABLED - using fallback if needed`,
    );

    // Ensure MongoDB connection before operations (with retry)
    try {
      await ensureConnection(3);
    } catch (error) {
      console.error('MongoDB connection failed:', error.message);
      throw new Error(`Database connection failed: ${error.message}`);
    }

    // Final connection state check
    const connectionState = mongoose.connection.readyState;
    if (connectionState !== 1) {
      const stateMap = {
        0: 'disconnected',
        2: 'connecting',
        3: 'disconnecting',
      };
      throw new Error(
        `MongoDB connection not ready. State: ${
          stateMap[connectionState] || connectionState
        }`,
      );
    }

    switch (type) {
      case 'user.created':
      case 'user.updated': {
        // Log full data for debugging
        console.log('Full Clerk event data:', JSON.stringify(data, null, 2));

        // Extract email from various possible locations - NEVER throw error if missing
        const email =
          data?.email_addresses?.[0]?.email_address ??
          data?.email_address ??
          data?.primary_email_address_id ??
          null;

        // Extract username
        const firstName = data?.first_name || '';
        const lastName = data?.last_name || '';
        const username =
          `${firstName} ${lastName}`.trim() ||
          data?.username ||
          data?.id ||
          'user';

        // Extract image
        const image =
          data?.image_url ?? data?.profile_image_url ?? data?.avatar_url ?? '';

        // Build user data with fallbacks - ALWAYS provide email fallback
        const userData = {
          _id: data.id,
          email: email || `${data.id}@clerk.local`,
          username: username || data.id,
          image: image || '',
          role: data?.role || 'user',
        };

        console.log(`Saving user to MongoDB:`, {
          id: userData._id,
          email: userData.email,
          username: userData.username,
          hasOriginalEmail: !!email,
        });

        await User.findByIdAndUpdate(
          data.id,
          {$set: userData},
          {upsert: true, new: true, setDefaultsOnInsert: true},
        );
        console.log(`User ${data.id} saved to MongoDB successfully`);
        break;
      }
      case 'user.deleted': {
        await User.findByIdAndDelete(data.id);
        console.log(`User ${data.id} deleted from MongoDB`);
        break;
      }
      default:
        console.log(`Unhandled Clerk webhook type: ${type}`);
        break;
    }
    return res.status(200).json({success: true, message: 'Webhook received'});
  } catch (error) {
    console.error('Clerk webhook error:', error);
    return res.status(400).json({success: false, message: error.message});
  }
};

export default clerkWebhooks;
