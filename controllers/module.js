import Module from '../models/module.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

  
// Ensure upload directory exists
const uploadDir = 'uploads/resources';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1 * 1024 * 1024 * 1024, // Limit to 1 GB
      },
    fileFilter: (req, file, cb) => {
      const filetypes = /pdf|mp4/;
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = filetypes.test(file.mimetype);
  
      if (mimetype && extname) {
        return cb(null, true);
      }
      cb('Error: File upload only supports the following filetypes - ' + filetypes);
    }
  });
// Create a new module
export const createModule = async (req, res) => {
  try {
    const { title, description, course } = req.body;

    const resources = {
      doc: req.files.doc && req.files.doc.length > 0 ? req.files.doc[0].filename : null,
      video: req.files.video && req.files.video.length > 0 ? req.files.video[0].filename : null,
    };

    const newModule = new Module({
      title,
      description,
      course,
      resources
    });

    const savedModule = await newModule.save();
    res.status(201).json(savedModule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const uploadModuleResources = upload.fields([{ name: 'doc', maxCount: 1 }, { name: 'video', maxCount: 1 }]);

// Get all modules
export const getAllModules = async (req, res) => {
  try {
    const modules = await Module.find();  // Populate course details
    res.status(200).json(modules);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a module by ID
export const getModuleById = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }
    res.status(200).json(module);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a module
export const updateModule = async (req, res) => {
  try {
    const updatedModule = await Module.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedModule) {
      return res.status(404).json({ error: 'Module not found' });
    }
    res.status(200).json(updatedModule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a module
export const deleteModule = async (req, res) => {
  try {
    const deletedModule = await Module.findByIdAndDelete(req.params.id);
    if (!deletedModule) {
      return res.status(404).json({ error: 'Module not found' });
    }
    res.status(200).json({ message: 'Module deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
