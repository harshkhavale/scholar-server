import { getReviewsByCourseId, postReview } from "../controllers/review.js";
import express from 'express';

const router = express.Router();

// Route to retrieve reviews by course ID
router.get("/:courseId", getReviewsByCourseId);

// Route to post a review
router.post("/", postReview);

export default router;