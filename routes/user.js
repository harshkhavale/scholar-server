import express from 'express';
import { createUser, getUserById, getAllUsers, updateUser, deleteUser, getUserEnrolls, enrollCourse, unrollCourse } from '../controllers/user.js';

const router = express.Router();

// Routes
router.post('/', createUser);
router.get('/:id', getUserById);
router.get('/', getAllUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.get('/:id/enrolls', getUserEnrolls);
router.post('/enroll', enrollCourse);
router.post('/unroll', unrollCourse);
export default router;
