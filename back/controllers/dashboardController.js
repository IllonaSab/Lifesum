const pool = require('../db');

// 🔵 GET les infos dashboard
exports.getDashboardData = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    const userId = user.rows[0].id;

    const meals = await pool.query(
      'SELECT meal_type, calories, proteins, carbs, fats FROM meals WHERE user_id = $1 AND meal_date = CURRENT_DATE',
      [userId]
    );

    return res.status(200).json({ meals: meals.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// 🔵 POST pour ajouter un repas
exports.addMeal = async (req, res) => {
  const { email } = req.params;
  const { meal_type, calories, proteins, carbs, fats } = req.body;

  if (!meal_type || !calories) {
    return res.status(400).json({ message: 'Données repas manquantes.' });
  }

  try {
    const user = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    const userId = user.rows[0].id;

    await pool.query(
      'INSERT INTO meals (user_id, meal_type, calories, proteins, carbs, fats) VALUES ($1, $2, $3, $4, $5, $6)',
      [userId, meal_type, calories, proteins, carbs, fats]
    );

    return res.status(201).json({ message: 'Repas ajouté avec succès.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
