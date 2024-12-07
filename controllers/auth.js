import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Educator from "../models/educator.js";
import path from 'path';
import multer from 'multer';

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profiles'); // Folder where files will be saved
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Register User function with file upload
export const registerUser = (req, res) => {
  upload.single('profilePic')(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ error: 'File upload failed.' });
    }

    const { fullName, email, password, plan, userType } = req.body;
    const profilePicPath = req.file ? req.file.filename : null; // Optional profile picture

    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists.' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new User({
        fullName,
        email,
        password: hashedPassword,
        plan,
        userType,
        profilePic: profilePicPath // Include profile picture if available
      });

      const savedUser = await newUser.save();

      // If userType is 'educator', create an educator record
      if (userType === 'educator') {
        const newEducator = new Educator({
          user_id: savedUser._id,
          fullName
        });
        await newEducator.save();
      }

      res.status(201).json({ message: 'User registered successfully', user: savedUser });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
};




export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check for existing user
    const user = await User.findOne({ email }).populate("enrolls");
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Prepare response object
    const response = {
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        plan: user.plan,
        userType: user.userType,
        profilePic: user.profilePic,
        enrolls: user.enrolls.map((enroll) => enroll._id),
      },
    };

    // If user is an educator, fetch educator details
    if (user.userType === "educator") {
      const educator = await Educator.findOne({ user_id: user._id }).populate("courses");
      if (educator) {
        response.educator = {
          id: educator._id,
          fullName: educator.fullName || user.fullName,
          description: educator.description,
          profileImage: educator.profile_image,
          backgroundImage: educator.background_image,
          qualifications: educator.qualifications,
          socialLinks: educator.social_links,
          specialties: educator.specialties,
          contactEmail: educator.contact_email,
          courses: educator.courses.map((course) => ({
            id: course._id,
            title: course.title,
            description: course.description,
            thumbnail: course.thumbnail,
            price: course.price,
          })),
        };
      }
    }

    // Return response
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
