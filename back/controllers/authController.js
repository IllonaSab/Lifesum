const pool = require('../db'); // Connexion à la base de données PostgreSQL
const bcrypt = require('bcryptjs'); // Pour hasher les mots de passe 
const jwt = require('jsonwebtoken'); // Pour générer des tokens JWT (authentification sécurisée)

//Fonction pour créer un nouvel utilisateur
const signup = async (req, res) => {
  const { name, email, password } = req.body;

  // Vérifie que tous les champs sont remplis et que le mot de passe est assez long
  if (!name || !email || !password || password.length < 8) {
    return res.status(400).json({ message: 'Champs invalides ou incomplets.' });
  }

  try {
// Vérifie si un utilisateur avec le même email existe déjà
    const checkUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (checkUser.rows.length > 0) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé.' });
    }

// Hash le mot de passe avant de le stocker en base de données
    const hashedPassword = await bcrypt.hash(password, 10);

// Insère le nouvel utilisateur dans la base de données et retourne les infos 
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );

    return res.status(201).json({ message: 'Compte créé avec succès !', user: newUser.rows[0] });
  } catch (err) {
    console.error('Erreur dans signup :', err);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

//Fonction de connexion avec génération de JWT
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
// Recherche l'utilisateur par email 
    const result = await pool.query(
      'SELECT * FROM users WHERE LOWER(email) = LOWER($1)',
      [email]
    );

    const user = result.rows[0];

// Renvoyer une erreur si l'utilisateur n'est pas retrouvé
    if (!user) {
      return res.status(401).json({ message: 'Email non trouvé.' });
    }

// Compare le mot de passe fourni avec le hash stocké
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

// Génère un token JWT qui expire dans 24h
    const token = jwt.sign(
      { id: user.id, email: user.email },
      'SECRET_KEY', // ⚠️ À remplacer par une vraie clé secrète dans les variables d’environnement
      { expiresIn: '24h' }
    );

// Envoie le token et les infos de l'utilisateur au client
    res.status(200).json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error('Erreur dans login :', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Fonction pour mettre à jour les infos du profil utilisateur
const updateProfile = async (req, res) => {
  const { email } = req.params;
  const {
    gender, birthdate, weight, height,
    calories, protein, carbs, fat
  } = req.body;

// Vérifie que les champs de base sont bien présents
  if (!gender || !birthdate || !weight || !height) {
    return res.status(400).json({ message: 'Tous les champs doivent être remplis.' });
  }

  let formattedDate;

// Formate la date de naissance si elle est envoyée sous forme d'objet (day/month/year)
  if (typeof birthdate === 'object' && birthdate.day && birthdate.month && birthdate.year) {
    const day = birthdate.day.padStart(2, '0');     // Ajoute un zéro si nécessaire (ex : 2 → 02)
    const month = birthdate.month.padStart(2, '0'); // Idem pour le mois
    formattedDate = `${birthdate.year}-${month}-${day}`;
  } else {
    formattedDate = birthdate; // Sinon, on garde la date telle qu’elle est
  }

  try {
// Met à jour les infos du profil dans la base
    const updatedUser = await pool.query(
      `UPDATE users 
       SET gender = $1, birthdate = $2, weight = $3, height = $4,
           calories = $5, protein = $6, carbs = $7, fat = $8
       WHERE email = $9
       RETURNING id, name, email, gender, birthdate, weight, height, calories, protein, carbs, fat`,
      [gender, formattedDate, weight, height, calories, protein, carbs, fat, email]
    );

// Si aucun utilisateur n'a été mis à jour, cela signifie qu’il n’existe pas
    if (updatedUser.rowCount === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    return res.status(200).json({ message: 'Profil mis à jour.', user: updatedUser.rows[0] });
  } catch (err) {
    console.error('Erreur dans updateProfile :', err);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Fonction pour récupérer les infos d’un utilisateur via son email
const getUserProfile = async (req, res) => {
  const { email } = req.params;
  try {
// Cherche un utilisateur par email
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

// Renvoie les données de l'utilisateur
    res.status(200).json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Exporte toutes les fonctions pour pouvoir les utiliser dans d’autres fichiers (ex : routes)
module.exports = {
  signup,
  login,
  updateProfile,
  getUserProfile
};
