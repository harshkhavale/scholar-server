// controllers/educatorController.js
import Educator from '../models/educator.js';

// Create a new educator
export const createEducator = async (req, res) => {
  const { user_id, courses, description } = req.body;

  try {
    const newEducator = new Educator({
      user_id,
      courses,
      description,
    });

    const savedEducator = await newEducator.save();
    res.status(201).json(savedEducator); // Return created educator
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all educators
export const getAllEducators = async (req, res) => {
  try {
    const educators = await Educator.find().populate('user_id courses'); // Populate user and course details
    res.status(200).json(educators);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get an educator by ID
export const getEducatorById = async (req, res) => {
  try {
    const educator = await Educator.findById(req.params.id).populate('user_id courses');
    if (!educator) {
      return res.status(404).json({ error: 'Educator not found' });
    }
    res.status(200).json(educator);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update an educator
export const updateEducator = async (req, res) => {
  try {
    const updatedEducator = await Educator.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEducator) {
      return res.status(404).json({ error: 'Educator not found' });
    }
    res.status(200).json(updatedEducator);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an educator
export const deleteEducator = async (req, res) => {
  try {
    const deletedEducator = await Educator.findByIdAndDelete(req.params.id);
    if (!deletedEducator) {
      return res.status(404).json({ error: 'Educator not found' });
    }
    res.status(200).json({ message: 'Educator deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
