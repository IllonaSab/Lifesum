const express = require('express');
const router = express.Router(); // Création d’un routeur Express pour définir les routes liées à l’authentification

// Importation des fonctions de contrôleur depuis le fichier authController
const {
  signup,          // pour l’inscription d’un nouvel utilisateur
  login,           // pour la connexion avec mot de passe
  updateProfile,   // pour la mise à jour du profil utilisateur
  getUserProfile   // pour récupérer les infos d’un utilisateur
} = require('../controllers/authController');

// Ce middleware décode l’email URL-encodé (ex. "%40" pour "@") pour le rendre lisible
router.param('email', (req, res, next, email) => {
  try {
    // Décode l’email encodé dans l’URL
    req.params.email = decodeURIComponent(email);
    next(); // Passe au middleware suivant ou au contrôleur
  } catch (err) {
    // En cas d’erreur de décodage, on renvoie une erreur 400 (Bad Request)
    return res.status(400).json({ message: 'Email invalide.' });
  }
});

// POST /signup = création d’un compte utilisateur
router.post('/signup', signup);

// POST /login = connexion de l’utilisateur 
router.post('/login', login);

// PUT /profile/:email = mise à jour des infos d’un utilisateur 
router.put('/profile/:email', updateProfile);

// GET /profile/:email = récupération des infos d’un utilisateur
router.get('/profile/:email', getUserProfile);

// Exporte le routeur pour qu’il soit utilisé dans app.js ou server.js
module.exports = router;
