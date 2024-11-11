// models/course.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    price: {
      type: String,
    },
    educator: {
      type: Schema.Types.ObjectId,
      ref: "Educator", // Reference to the Educator model
      required: true,
    },
    modules: [
      {
        type: Schema.Types.ObjectId,
        ref: "Module", // Reference to the Module model
      },
    ],
    languages: [
      {
        type: String,
        required: false,
      },
    ],
    topics: [
      {
        type: String,
        required: false,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Course', courseSchema);
