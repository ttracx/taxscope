import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export const PLANS = {
  pro: {
    name: 'TaxScope Pro',
    price: 49,
    priceId: process.env.STRIPE_PRICE_ID!,
    features: [
      'AI-powered deduction finder',
      'Tax bracket calculator',
      'Quarterly estimate tracker',
      'Document upload & analysis',
      'Personalized tax tips',
      'Year-end planning tools',
      'Unlimited AI conversations',
      'Priority support',
    ],
  },
}
