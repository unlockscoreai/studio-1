import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Assume you have a database utility or service
// import { database } from '@/lib/database'; // Replace with your actual path

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil', // Updated API version
});

export async function POST(req: NextRequest) {
  try {
    const { tradelineType, userId } = await req.json(); // Assuming userId is sent from the frontend

    // TODO: Replace with your actual user retrieval logic
    // Example using a hypothetical database utility:
    // const user = await database.getUserById(userId);

    // For demonstration, let's assume you have a user object like this after retrieval:
    const user = { // Replace with your actual user object structure
        id: userId,
        stripeCustomerId: 'cus_ABC123', // Replace with the actual retrieved Stripe Customer ID
        // other user properties...
    };

    if (!user || !user.stripeCustomerId) {
      return NextResponse.json({ error: 'User or Stripe Customer ID not found' }, { status: 404 });
    }

    // This is a placeholder. Replace with your actual product logic.
    const itemDetails: { [key: string]: { name: string; amount: number; currency: string; } } = {
      'Revolving Tradeline': { name: 'Revolving Tradeline', amount: 150000, currency: 'usd' }, // amount in cents
      'Auto Tradeline': { name: 'Auto Tradeline', amount: 250000, currency: 'usd' }, // amount in cents
    };

    const selectedItem = itemDetails[tradelineType];

    if (!selectedItem) {
      return NextResponse.json({ error: 'Invalid tradeline type' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: selectedItem.currency,
            product_data: {
              name: selectedItem.name,
            },
            unit_amount: selectedItem.amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // Use the retrieved stripeCustomerId here
      customer: user.stripeCustomerId, // Uncommented and using the retrieved ID
      success_url: `${req.nextUrl.origin}/client/dashboard?success=true`,
      cancel_url: `${req.nextUrl.origin}/client/tradeline-strategy?canceled=true`,
      // Optionally include client_reference_id to link the session to your internal user ID
      client_reference_id: userId,
    });

    return NextResponse.json({ id: session.id });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
