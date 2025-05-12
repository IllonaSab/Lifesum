const express = require('express');
const router = express.Router(); // Création d’un routeur Express

// Import du middleware d’authentification
const verifyToken = require('../middleware/verifyToken');

// Route GET /dashboard protégée par le middleware verifyToken
router.get('/dashboard', verifyToken, (req, res) => {
  // Si verifyToken passe, req.user contient les infos décodées du token JWT (ex: id, email, role, etc.)

  res.json({
    message: `Bienvenue, ${req.user.email}`, // Message personnalisé avec l'email de l'utilisateur connecté
    data: 'Voici tes données privées.'       // Exemple de données privées
  });
});

// Exportation du routeur pour être utilisé dans app.js
module.exports = router;
