import User from '../models/User.js';
import {Webhook} from 'svix';

const clerkWebhooks = async (req, res) => {
  try {
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

    switch (type) {
      case 'user.created':
      case 'user.updated': {
        const email =
          data?.email_addresses?.[0]?.email_address ?? data?.email_address;
        const username = `${data?.first_name ?? ''} ${
          data?.last_name ?? ''
        }`.trim();
        const image = data?.image_url ?? data?.profile_image_url ?? '';

        const userData = {
          _id: data.id,
          email: email || `${data.id}@clerk.local`,
          username:
            username ||
            data?.username ||
            (email ? email.split('@')[0] : data.id),
          image,
        };

        await User.findByIdAndUpdate(
          data.id,
          {$set: userData},
          {upsert: true, new: true, setDefaultsOnInsert: true},
        );
        break;
      }
      case 'user.deleted': {
        await User.findByIdAndDelete(data.id);
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
