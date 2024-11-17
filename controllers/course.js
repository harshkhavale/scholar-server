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
export const getCourseModules = async (req, res) => {
  try {
    const courseId = req.params.id;

    // Find the course by ID and populate the modules
    const courseWithModules = await Course.findById(courseId).populate('modules');

    if (!courseWithModules) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Extract just the modules array
    const { modules } = courseWithModules;

    // Return the modules array along with the total number of modules
    res.status(200).json({
      total: modules.length,  // Total number of modules
      modules: modules        // The array of modules
    });
  } catch (error) {
    console.error('Error fetching course with modules:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add module to course
export const addModuleToCourse = async (req, res) => {
  try {
    const { id, moduleId } = req.params;

    // Find the course by ID
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if module is already added
    if (course.modules.includes(moduleId)) {
      return res.status(400).json({ error: 'Module already added to the course' });
    }

    // Add module to the course's modules array
    course.modules.push(moduleId);
    await course.save();

    res.status(200).json({ message: 'Module added successfully', course });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Remove module from course
export const removeModuleFromCourse = async (req, res) => {
  try {
    const { id, moduleId } = req.params;

    // Find the course by ID
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Remove the module from the course's modules array
    course.modules = course.modules.filter(id => id.toString() !== moduleId);
    await course.save();

    res.status(200).json({ message: 'Module removed successfully', course });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
