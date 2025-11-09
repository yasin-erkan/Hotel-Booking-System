import User from '../models/User.js';
import {Webhook} from 'svix';

const clerkWebhooks = async (req, res) => {
  try {
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
    const payload =
      typeof req.body === 'string'
        ? req.body
        : Buffer.from(req.body).toString('utf8');
    const event = await webhook.verify(payload, headers);

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

        if (!email) {
          throw new Error(`Missing email for Clerk event: ${type}`);
        }

        const userData = {
          _id: data.id,
          email,
          username: username || data?.username || email.split('@')[0],
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
