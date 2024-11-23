import Stripe from 'stripe';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

// Initialize Stripe with the secret key from the environment variable
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15', // Specify Stripe API version
});

export default stripe;
