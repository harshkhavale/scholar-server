import mongoose from "mongoose";
const { Schema } = mongoose;

// Define the Educator schema
const educatorSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    courses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course", // Reference to the Course model
      },
    ],
    description: {
      type: String, // Description of the educator or the course they provide
      required: false,
    },
    fullName: {
      type: String, // Description of the educator or the course they provide
      required: false,
    },
    profile_image: {
      type: String, // URL or path to the educator's profile image
      required: false,
    },
    background_image: {
      type: String, // URL or path to the educator's background/cover image
      required: false,
    },
    qualifications: {
      
        degree: {
          type: String, // Degree or certification title
          required: false,
        },
        institution: {
          type: String, // Institution name
          required: false,
        },
        year: {
          type: Number, // Year of graduation or completion
          required: false,
        },
      
    },
    social_links: {
      linkedin: {
        type: String, // LinkedIn profile link
        required: false,
      },
      twitter: {
        type: String, // Twitter profile link
        required: false,
      },
      website: {
        type: String, // Personal or professional website link
        required: false,
      },
    },
    specialties: [
      {
        type: String, // Areas of expertise or specialization
        required: false,
      },
    ],
    contact_email: {
      type: String, // Public-facing contact email for inquiries
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Educator", educatorSchema);
