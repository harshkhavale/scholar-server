import mongoose from 'mongoose';
const { Schema } = mongoose;

// Define the User schema
const userSchema = new Schema({
  profilePic: {
    type: String,  // URL or file path to the profile picture
    required: false
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  plan: {
    type: String,  // E.g., 'free', 'premium', 'enterprise'
    enum: ['free', 'premium', 'enterprise'],  // Optional: restrict to specific values
    default: 'free'
  },
  enrolls: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Course',  // Reference to the Enroll model
      required: false
    }
  ],
  userType: {
    type: String,
    required: true,
    enum: ['student', 'educator', 'admin'],  // Define specific user roles
    default: 'student'
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);

