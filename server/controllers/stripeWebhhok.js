import stripe from 'stripe';
import Booking from '../models/Booking.js';
import {ensureConnection} from '../configs/db.js';

//API to handle stripe Webhooks

export const stripeWebHooks = async (request, response) => {
  try {
    await ensureConnection();

    // stripe Gateway initialize
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const sig = request.headers['stripe-signature'];
    let event;

    try {
      event = stripeInstance.webhooks.constructEvent(
        request.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (error) {
      return response.status(400).send(`Webhook Error: ${error.message}`);
    }

    // handle the event
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      // Getting Session Metadata
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntent.id,
      });
      const {bookingId} = session.data[0].metadata;
      //mark payment as Paid
      await Booking.findByIdAndUpdate(bookingId, {
        isPaid: true,
        paymentMethod: 'Stripe',
      });
    } else {
      console.log('Unhandled event type:', event.type);
    }

    response.json({received: true});
  } catch (error) {
    console.error('Stripe webhook error:', error);
    response.status(500).json({success: false, message: error.message});
  }
};
