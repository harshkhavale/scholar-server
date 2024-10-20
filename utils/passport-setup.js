import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import GitHubStrategy from 'passport-github2';
import User from './models/user.js'; // Adjust the path as necessary

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

// Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  const existingUser = await User.findOne({ email: profile.emails[0].value });
  if (existingUser) {
    return done(null, existingUser);
  }
  const newUser = await new User({
    fullName: profile.displayName,
    email: profile.emails[0].value,
    userType: 'student', // or whatever default you want
  }).save();
  done(null, newUser);
}));

// GitHub Strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: '/auth/github/callback',
}, async (accessToken, refreshToken, profile, done) => {
  const existingUser = await User.findOne({ email: profile.emails[0].value });
  if (existingUser) {
    return done(null, existingUser);
  }
  const newUser = await new User({
    fullName: profile.displayName,
    email: profile.emails[0].value,
    userType: 'student', // or whatever default you want
  }).save();
  done(null, newUser);
}));
