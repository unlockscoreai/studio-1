import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { buffer } from 'micro';

// Stripe needs the raw body to verify the signature
export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil', // Updated API version
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const reqBuffer = await buffer(req);

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(reqBuffer, sig!, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session; // Corrected type import
      console.log(`Checkout session completed for session ID: ${session.id}`);
      // TODO: Fulfill the purchase, grant access to the tradeline, send confirmation email, etc.
      // You can access information about the purchase from the session object.
      break;
    // Handle other event types as needed
    // case 'payment_intent.succeeded':
    //   const paymentIntent = event.data.object as Stripe.PaymentIntent;
    //   console.log(`PaymentIntent was successful!`);
    //   break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  return NextResponse.json({ received: true }, { status: 200 });
}
