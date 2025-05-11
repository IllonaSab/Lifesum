const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

router.get('/dashboard', verifyToken, (req, res) => {
  res.json({
    message: `Bienvenue, ${req.user.email}`,
    data: 'Voici tes données privées.'
  });
});

module.exports = router;
