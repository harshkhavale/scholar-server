// routes/educatorRoutes.js
import express from 'express';
import {
  createEducator,
  getAllEducators,
  getEducatorById,
  updateEducator,
  deleteEducator,
} from '../controllers/educator.js';

const router = express.Router();

// Define routes for educator
router.post('/', createEducator); // Create a new educator
router.get('/', getAllEducators); // Get all educators
router.get('/:id', getEducatorById); // Get educator by ID
router.put('/:id', updateEducator); // Update educator by ID
router.delete('/:id', deleteEducator); // Delete educator by ID

export default router;
