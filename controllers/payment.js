// controllers/paymentController.js
import Payment from "../models/payment.js";
import stripe from "../utils/stripe.js";

// Create a new payment
export const createPayment = async (req, res) => {
  const { user_id, amount, status, transactionId } = req.body;

  try {
    const newPayment = new Payment({
      user_id,
      amount,
      status,
      transactionId,
    });

    const savedPayment = await newPayment.save();
    res.status(201).json(savedPayment); // Return created payment
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all payments
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate("user_id"); // Populate user details
    res.status(200).json(payments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a payment by ID
export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate("user_id");
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }
    res.status(200).json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a payment
export const updatePayment = async (req, res) => {
  try {
    const updatedPayment = await Payment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedPayment) {
      return res.status(404).json({ error: "Payment not found" });
    }
    res.status(200).json(updatedPayment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a payment
export const deletePayment = async (req, res) => {
  try {
    const deletedPayment = await Payment.findByIdAndDelete(req.params.id);
    if (!deletedPayment) {
      return res.status(404).json({ error: "Payment not found" });
    }
    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const paymentIntent = async (req, res) => {
  const { amount } = req.body;

  try {
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
    });

    // Send the client secret to the frontend
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
