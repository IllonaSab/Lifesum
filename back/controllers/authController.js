const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 🔵 Fonction pour créer un nouvel utilisateur
const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password || password.length < 8) {
    return res.status(400).json({ message: 'Champs invalides ou incomplets.' });
  }

  try {
    const checkUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (checkUser.rows.length > 0) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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

// 🔐 Fonction de connexion avec JWT
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE LOWER(email) = LOWER($1)',
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Email non trouvé.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      'SECRET_KEY',
      { expiresIn: '24h' }
    );

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

// 🔵 Fonction pour mettre à jour le profil utilisateur
const updateProfile = async (req, res) => {
  const { email } = req.params;
  const {
    gender, birthdate, weight, height,
    calories, protein, carbs, fat
  } = req.body;

  if (!gender || !birthdate || !weight || !height) {
    return res.status(400).json({ message: 'Tous les champs doivent être remplis.' });
  }

  let formattedDate;
  if (typeof birthdate === 'object' && birthdate.day && birthdate.month && birthdate.year) {
    const day = birthdate.day.padStart(2, '0');
    const month = birthdate.month.padStart(2, '0');
    formattedDate = `${birthdate.year}-${month}-${day}`;
  } else {
    formattedDate = birthdate;
  }

  try {
    const updatedUser = await pool.query(
      `UPDATE users 
       SET gender = $1, birthdate = $2, weight = $3, height = $4,
           calories = $5, protein = $6, carbs = $7, fat = $8
       WHERE email = $9
       RETURNING id, name, email, gender, birthdate, weight, height, calories, protein, carbs, fat`,
      [gender, formattedDate, weight, height, calories, protein, carbs, fat, email]
    );

    if (updatedUser.rowCount === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    return res.status(200).json({ message: 'Profil mis à jour.', user: updatedUser.rows[0] });
  } catch (err) {
    console.error('Erreur dans updateProfile :', err);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// 🔍 Fonction pour récupérer le profil utilisateur
const getUserProfile = async (req, res) => {
  const { email } = req.params;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }
    res.status(200).json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = {
  signup,
  login,
  updateProfile,
  getUserProfile
};
