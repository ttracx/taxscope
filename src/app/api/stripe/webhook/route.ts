import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    // In production, verify webhook signature
    event = JSON.parse(body) as Stripe.Event
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      console.log('Checkout completed:', session.customer_email)
      // TODO: Update user subscription in database
      break
    }
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      console.log('Subscription updated:', subscription.id)
      break
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      console.log('Subscription canceled:', subscription.id)
      break
    }
  }

  return NextResponse.json({ received: true })
}
