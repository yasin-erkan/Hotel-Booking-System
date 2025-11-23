import stripe from 'stripe';
import Booking from '../models/Booking.js';
import {ensureConnection} from '../configs/db.js';

//API to handle stripe Webhooks

export const stripeWebHooks = async (request, response) => {
  try {
    await ensureConnection();

    console.log('=== STRIPE WEBHOOK RECEIVED ===');

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
      console.log('Webhook event type:', event.type);
    } catch (error) {
      console.error('Webhook verification error:', error.message);
      return response.status(400).send(`Webhook Error: ${error.message}`);
    }

    // handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log('Session data:', {
        id: session.id,
        metadata: session.metadata,
        payment_status: session.payment_status,
      });

      const {bookingId} = session.metadata || {};

      if (!bookingId) {
        console.error('No bookingId in session metadata');
        console.log('Full session object:', JSON.stringify(session, null, 2));
        return response
          .status(400)
          .json({success: false, message: 'No bookingId found'});
      }

      console.log('Updating booking:', bookingId);

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

      console.log('Payment marked as paid for booking:', bookingId);
      console.log('Updated booking:', {
        id: updatedBooking._id,
        isPaid: updatedBooking.isPaid,
        paymentMethod: updatedBooking.paymentMethod,
      });
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
        console.log(
          'Payment marked as paid for booking (from payment_intent):',
          bookingId,
        );
      } else {
        console.log('Payment intent succeeded but no bookingId in metadata');
      }
    } else {
      console.log('Unhandled event type:', event.type);
    }

    response.json({received: true});
  } catch (error) {
    console.error('Stripe webhook error:', error);
    response.status(500).json({success: false, message: error.message});
  }
};
