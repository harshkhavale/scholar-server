// routes/paymentRoutes.js
import express from 'express';
import {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
} from '../controllers/payment.js';

const router = express.Router();

// Define routes for payment
router.post('/', createPayment); // Create a new payment
router.get('/', getAllPayments); // Get all payments
router.get('/:id', getPaymentById); // Get payment by ID
router.put('/:id', updatePayment); // Update payment by ID
router.delete('/:id', deletePayment); // Delete payment by ID

export default router;
