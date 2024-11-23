import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import session from "express-session"
import passport from "passport"
//routes
import userRoutes from "./routes/user.js"; // Import user routes
import moduleRoutes from "./routes/module.js"; // Import user routes
import courseRoutes from "./routes/course.js"; // Import user routes
import educatorRoutes from "./routes/educator.js"; // Import user routes
import paymentRoutes from "./routes/payment.js"; // Import user routes
import authRoutes from "./routes/auth.js"; // Import user routes
import cors from "cors";
import morgan from "morgan";
dotenv.config(); // Load environment variables from .env file

// Set up express app
const app = express();
const PORT = process.env.PORT || 5001;
app.use(morgan('combined')); 

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
  origin: "*",  // Allow requests from any origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
}));
// Serve static files from 'uploads' folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/educators", educatorRoutes);
app.use("/api/payments", paymentRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Test connection route
app.get("/", (req, res) => {
  res.send("SCHOLAR API is running!");
});

// Start the server
app.listen(PORT,"0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
