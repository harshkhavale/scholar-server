import express from 'express';
import { registerUser, loginUser } from '../controllers/auth.js';
import passport from 'passport';

const router = express.Router();

// Registration Route
router.post('/register', registerUser);

// Login Route
router.post('/login', loginUser);

// Google Authentication Routes
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

router.get('/google/callback', passport.authenticate('google'), (req, res) => {
  // Successful authentication
  res.redirect('/'); // Redirect to your desired URL after login
});

// GitHub Authentication Routes
router.get('/github', passport.authenticate('github', {
  scope: ['user:email'],
}));

router.get('/github/callback', passport.authenticate('github'), (req, res) => {
  // Successful authentication
  res.redirect('/'); // Redirect to your desired URL after login
});

export default router;
