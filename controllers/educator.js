import Educator from "../models/educator.js";
import path from "path";
import fs from "fs";
import multer from "multer";
import { fileURLToPath } from "url";

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profiles"); // Folder for educator profile/background images
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + extension); // Example: profileImage-123456.jpg
  },
});

const upload = multer({ storage: storage });

// Create a new educator
export const createEducator = async (req, res) => {
  upload.fields([
    { name: "profile_image", maxCount: 1 },
    { name: "background_image", maxCount: 1 },
  ])(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ error: "File upload failed." });
    }

    const profileImagePath = req.files?.profile_image?.[0]?.filename || null;
    const backgroundImagePath = req.files?.background_image?.[0]?.filename || null;

    const {
      user_id,
      courses,
      description,
      fullName,
      qualifications,
      social_links,
      specialties,
      contact_email,
    } = req.body;

    try {
      const newEducator = new Educator({
        user_id,
        courses,
        description,
        fullName,
        profile_image: profileImagePath,
        background_image: backgroundImagePath,
        qualifications,
        social_links,
        specialties,
        contact_email,
      });

      const savedEducator = await newEducator.save();
      res.status(201).json(savedEducator); // Return created educator
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
};

// Update an educator with optional image replacement
export const updateEducator = async (req, res) => {
  upload.fields([
    { name: "profile_image", maxCount: 1 },
    { name: "background_image", maxCount: 1 },
  ])(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ error: "File upload failed." });
    }

    const educatorId = req.params.id;
    const profileImagePath = req.files?.profile_image?.[0]?.filename || null;
    const backgroundImagePath = req.files?.background_image?.[0]?.filename || null;

    const updateData = {
      ...req.body,
      profile_image: profileImagePath || req.body.profile_image, // Retain old image if not updated
      background_image: backgroundImagePath || req.body.background_image, // Retain old image if not updated
    };

    // Remove undefined properties
    Object.keys(updateData).forEach((key) => updateData[key] === undefined && delete updateData[key]);

    try {
      const updatedEducator = await Educator.findByIdAndUpdate(educatorId, updateData, { new: true });
      if (!updatedEducator) {
        return res.status(404).json({ error: "Educator not found" });
      }
      res.status(200).json(updatedEducator);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
};

// Delete an educator and associated images
export const deleteEducator = async (req, res) => {
  const educatorId = req.params.id;

  try {
    const educator = await Educator.findByIdAndDelete(educatorId);
    if (!educator) {
      return res.status(404).json({ error: "Educator not found" });
    }

    // Delete associated images
    const deleteFile = (filePath) => {
      if (filePath) {
        const fullPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "../uploads/profiles", filePath);
        fs.unlink(fullPath, (err) => {
          if (err) console.error("Failed to delete file:", err);
        });
      }
    };

    deleteFile(educator.profile_image);
    deleteFile(educator.background_image);

    res.json({ message: "Educator deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get an educator by user_id
export const getEducatorByUserId = async (req, res) => {
  const { user_id } = req.params;

  try {
    const educator = await Educator.findOne({ user_id })
      .populate("user_id", "name email") // Populate user details (e.g., name, email)
      .populate("courses", "title description"); // Populate course details (e.g., title, description)
    if (!educator) {
      return res.status(404).json({ error: "Educator not found" });
    }
    res.status(200).json(educator);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an educator by user_id
export const updateEducatorByUserId = async (req, res) => {
  upload.fields([
    { name: "profile_image", maxCount: 1 },
    { name: "background_image", maxCount: 1 },
  ])(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ error: "File upload failed." });
    }

    const { user_id } = req.params;
    const profileImagePath = req.files?.profile_image?.[0]?.filename || null;
    const backgroundImagePath = req.files?.background_image?.[0]?.filename || null;

    const updateData = {
      ...req.body,
      profile_image: profileImagePath || req.body.profile_image, // Retain old image if not updated
      background_image: backgroundImagePath || req.body.background_image, // Retain old image if not updated
    };

    // Remove undefined properties
    Object.keys(updateData).forEach((key) => updateData[key] === undefined && delete updateData[key]);

    try {
      const updatedEducator = await Educator.findOneAndUpdate(
        { user_id },
        updateData,
        { new: true } // Return updated document
      );
      if (!updatedEducator) {
        return res.status(404).json({ error: "Educator not found" });
      }
      res.status(200).json(updatedEducator);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};
export const getAllEducators = async (req, res) => {
  try {
    // Fetch all educators and populate referenced fields
    const educators = await Educator.find()
      .populate("user_id", "fullName email profilePic") // Populate user details
      .populate("courses", "title description") // Populate course details
      .select("-__v"); // Exclude internal fields like "__v" if necessary

    res.status(200).json(educators);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEducatorById = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the educator by ID and populate relevant fields
    const educator = await Educator.findById(id)
      .populate("user_id", "fullName email profilePic") // Populate user details
      .populate("courses", "title description"); // Populate course details

    if (!educator) {
      return res.status(404).json({ error: "Educator not found" });
    }

    res.status(200).json(educator);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
