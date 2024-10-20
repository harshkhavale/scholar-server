// controllers/courseController.js
import Course from '../models/course.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/thumbnails');  // Folder where thumbnails will be saved
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, 'thumbnail-' + uniqueSuffix + extension);  // e.g., thumbnail-123456789.jpg
  }
});

const upload = multer({ storage: storage });

// Create a new course
export const createCourse = (req, res) => {
  upload.single('thumbnail')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: 'File upload failed.' });
    }

    const { title, description, educator, languages, topics } = req.body;
    const thumbnailPath = req.file ? req.file.filename : null; // Store thumbnail filename in DB

    try {
      const newCourse = new Course({
        title,
        description,
        thumbnail: thumbnailPath,
        educator,
        languages: languages ? languages.split(',') : [],  // Convert comma-separated string to array
        topics: topics ? topics.split(',') : [],  // Convert comma-separated string to array
      });

      const savedCourse = await newCourse.save();
      res.status(201).json(savedCourse);  // Return created course
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
};

// Get all courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('educator modules');  // Populate educator and modules details
    res.status(200).json(courses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a course by ID
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('educator modules');
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a course
export const updateCourse = async (req, res) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.status(200).json(updatedCourse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a course
export const deleteCourse = async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
