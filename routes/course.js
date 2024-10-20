// routes/courseRoutes.js
import express from 'express';
import { createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse } from '../controllers/course.js';

const router = express.Router();

// Course routes
router.post('/', createCourse);  // POST request to create a new course
router.get('/', getAllCourses);  // GET request to fetch all courses
router.get('/:id', getCourseById);  // GET request to fetch a specific course
router.put('/:id', updateCourse);  // PUT request to update a specific course
router.delete('/:id', deleteCourse);  // DELETE request to delete a specific course

export default router;
