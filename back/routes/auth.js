const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  updateProfile,
  getUserProfile
} = require('../controllers/authController');

// Middleware pour décoder les emails dans les routes avec :email
router.param('email', (req, res, next, email) => {
  try {
    req.params.email = decodeURIComponent(email);
    next();
  } catch (err) {
    return res.status(400).json({ message: 'Email invalide.' });
  }
});

// Auth routes
router.post('/signup', signup);
router.post('/login', login);
router.put('/profile/:email', updateProfile);
router.get('/profile/:email', getUserProfile);

module.exports = router;
