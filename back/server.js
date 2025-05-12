const express = require('express');       // Import du framework Express
const cors = require('cors');             // Middleware pour permettre les requêtes cross-origin (utile pour frontend <> backend)
const bodyParser = require('body-parser'); // Middleware pour parser les corps de requêtes en JSON (peut être remplacé par express.json())

// Import des fichiers de routes
const authRoutes = require('./routes/auth');             // Routes liées à l'authentification
const dashboardRoutes = require('./routes/dashboard');   // Routes liées au tableau de bord (données utilisateur)

const app = express();          // Création de l'app Express
const PORT = 5000;              // Port sur lequel le serveur va écouter

// Activation des middlewares globaux
app.use(cors());                // Active les CORS pour permettre au frontend d'accéder à l'API
app.use(bodyParser.json());     // Transforme le JSON reçu dans les requêtes en objets JS accessibles via req.body

// Montage des routes
app.use('/api', authRoutes);        // Toutes les routes dans authRoutes commenceront par /api (ex : /api/signup)
app.use('/api', dashboardRoutes);   // Routes du dashboard (ex : /api/dashboard)

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`✅ Backend API running on http://localhost:${PORT}`);
});
