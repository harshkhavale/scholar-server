// models/module.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const moduleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',  // Reference to the Course model
    required: true
  },
  resources: {
    doc: {
      type: String,  // URL or path to course-related documents
      required: false
    },
    video: {
      type: String,  // URL or path to course-related videos
      required: false
    }
  }
}, { timestamps: true });

export default mongoose.model('Module', moduleSchema);
