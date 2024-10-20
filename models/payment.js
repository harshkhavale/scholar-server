import mongoose from 'mongoose';
const { Schema } = mongoose;

// Define the Payment schema
const paymentSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',  // Reference to the User model
    required: true
  },
  amount: {
    type: Number,  // Amount paid
    required: true
  },
  status: {
    type: String,  // Payment status
    enum: ['pending', 'completed', 'failed'],
    required: true,
    default: 'pending'
  },
  transactionId: {
    type: String,  // Unique transaction ID for the payment
    required: true,
    unique: true
  }
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);
