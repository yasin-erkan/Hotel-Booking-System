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
      console.error('Webhook verification error:', error.message);
      return response.status(400).send(`Webhook Error: ${error.message}`);
    }

    // handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const {bookingId} = session.metadata || {};

      if (!bookingId) {
        console.error('No bookingId in session metadata');
        return response
          .status(400)
          .json({success: false, message: 'No bookingId found'});
      }

      // Mark payment as Paid
      const updatedBooking = await Booking.findByIdAndUpdate(
        bookingId,
        {
          isPaid: true,
          paymentMethod: 'Stripe',
        },
        {new: true},
      );

      if (!updatedBooking) {
        console.error('Booking not found:', bookingId);
        return response
          .status(404)
          .json({success: false, message: 'Booking not found'});
      }
    } else if (event.type === 'payment_intent.succeeded') {
      // Fallback: Try to get bookingId from payment intent metadata
      const paymentIntent = event.data.object;
      if (paymentIntent.metadata && paymentIntent.metadata.bookingId) {
        const {bookingId} = paymentIntent.metadata;
        await Booking.findByIdAndUpdate(
          bookingId,
          {
            isPaid: true,
            paymentMethod: 'Stripe',
          },
          {new: true},
        );
      }
    }

    response.json({received: true});
  } catch (error) {
    console.error('Stripe webhook error:', error);
    response.status(500).json({success: false, message: error.message});
  }
};
