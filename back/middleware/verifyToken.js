const jwt = require('jsonwebtoken'); // Importation du module pour manipuler les JWT

// Middleware pour vérifier la validité du token JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization; // Récupère l'en-tête Authorization

  // Vérifie que le token est présent et commence bien par "Bearer"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ message: 'Token manquant ou invalide.' });
  }

  // Récupère la vraie valeur du token (enlève "Bearer ")
  const token = authHeader.split(' ')[1];

  try {
    // Vérifie et décode le token avec la clé secrète
    const decoded = jwt.verify(token, 'SECRET_KEY'); // ⚠️ À remplacer par une variable d’environnement

    // Ajoute les infos de l'utilisateur (payload du token) à l'objet req pour l'utiliser plus tard
    req.user = decoded;

    next(); // Passe au middleware ou au contrôleur suivant
  } catch (err) {
    // Token invalide ou expiré
    res.status(401).json({ message: 'Token invalide ou expiré.' });
  }
};

module.exports = verifyToken; // Export du middleware pour pouvoir l'utiliser dans les routes
