import express from "express";
import {
  createEducator,
  getAllEducators,
  getEducatorById,
  getEducatorByUserId,
  updateEducator,
  updateEducatorByUserId,
  deleteEducator,
} from "../controllers/educator.js";

const router = express.Router();

// Educator routes
router.post("/", createEducator); // Create a new educator
router.get("/", getAllEducators); // Get all educators
router.get("/:id", getEducatorById); // Get an educator by ID
router.get("/user/:user_id", getEducatorByUserId); // Get an educator by user ID
router.put("/:id", updateEducator); // Update an educator by ID
router.put("/user/:user_id", updateEducatorByUserId); // Update an educator by user ID
router.delete("/:id", deleteEducator); // Delete an educator by ID

export default router;
