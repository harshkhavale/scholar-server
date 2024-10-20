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
  },
  { timestamps: true }
);

export default mongoose.model('Educator', educatorSchema);
