// This is your test secret API key.
import type { NextApiRequest, NextApiResponse } from 'next'
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'POST') {
      const finalPrice = req.body

      if (!finalPrice) {
        return res.status(400).json({ error: 'Invalid request' })
      }

      const finalPriceInCents = Math.round(finalPrice * 100)

      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: finalPriceInCents,
        currency: 'usd',
        automatic_payment_methods: {
          enabled: true,
        },
      })

      res.json({ clientSecret: paymentIntent.client_secret })
    } else {
      res.status(405).json({ error: 'Method Not Allowed' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
