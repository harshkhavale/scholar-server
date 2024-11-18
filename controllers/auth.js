import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { createUser } from "./user.js";

// Registration API
export const registerUser = async (req, res) => {
  const { fullName, email, password, plan, userType } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new User document
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,  // Store the hashed password
      plan,
      userType
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    // Respond with the newly created user
    return res.status(201).json({ message: 'User registered successfully', user: savedUser });
  } catch (error) {
    // If any error occurs during user creation, return the error
    return res.status(400).json({ error: error.message });
  }
};


// Login API
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check for existing user
    const user = await User.findOne({ email });
    if (!user) {
      // Only send one response
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Only send one response
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Return token and user info
    return res.status(200).json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        plan: user.plan,
        userType: user.userType,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.error(error);
    // Only send one response
    return res.status(500).json({ error: "Internal server error" });
  }
};
