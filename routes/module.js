// routes/moduleRoutes.js
import express from 'express';
import { createModule, getAllModules, getModuleById, updateModule, deleteModule, uploadModuleResources } from '../controllers/module.js';

const router = express.Router();

// Module routes
router.post('/', uploadModuleResources, createModule);
router.get('/', getAllModules);  // GET request to fetch all modules
router.get('/:id', getModuleById);  // GET request to fetch a specific module
router.put('/:id', updateModule);  // PUT request to update a specific module
router.delete('/:id', deleteModule);  // DELETE request to delete a specific module

export default router;
