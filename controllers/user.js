// controllers/userController.js
import User from '../models/user.js';  // Import the User model
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profiles');  // Folder where files will be saved
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);  // e.g., profilePic-123456789.jpg
  }
});

const upload = multer({ storage: storage });

// Create a new user
export const createUser = async (req, res) => {
  upload.single('profilePic')(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ error: 'File upload failed.' });
    }

    const profilePicPath = req.file ? req.file.filename : null;  // Store filename in DB

    const { fullName, email, password, plan, userType } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }
    try {
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        profilePic: profilePicPath,
        fullName,
        email,
        password: hashedPassword,  // Store the hashed password
        plan,
        userType
      });

      const savedUser = await newUser.save();
      res.status(201).json(savedUser);  // Return created user
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
};

// Get a user by ID
export const getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId).populate('enrolls');  // Populate enrolls with Course references
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate('enrolls');  // Populate enrolls with Course references
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user by ID
export const updateUser = async (req, res) => {
  upload.single('profilePic')(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ error: 'File upload failed.' });
    }

    const userId = req.params.id;
    const profilePicPath = req.file ? req.file.filename : null;  // Store new filename if uploaded

    const updateData = {
      fullName: req.body.fullName,
      email: req.body.email, // Update email
      password: req.body.password ? await bcrypt.hash(req.body.password, 10) : undefined,  // Hash new password if provided
      plan: req.body.plan,
      userType: req.body.userType,
      profilePic: profilePicPath ? profilePicPath : req.body.profilePic  // Keep old if no new pic uploaded
    };

    // Remove undefined properties from updateData
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    try {
      const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

// Delete a user by ID
export const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete the profile picture from the server if exists
    if (user.profilePic) {
      const filePath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../uploads', user.profilePic);
      fs.unlink(filePath, err => {
        if (err) {
          console.error('Failed to delete profile picture:', err);
        }
      });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
