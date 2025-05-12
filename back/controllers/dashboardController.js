const pool = require('../db'); // Connexion à la base de données PostgreSQL via le pool

// 🔵 GET : Récupérer les infos du tableau de bord (repas du jour)
exports.getDashboardData = async (req, res) => {
  const { email } = req.params; // Récupère l'email depuis l'URL

  try {
    // Recherche l'utilisateur par email pour obtenir son ID
    const user = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    const userId = user.rows[0].id;

    // Récupère tous les repas du jour (CURRENT_DATE) pour cet utilisateur
    const meals = await pool.query(
      'SELECT meal_type, calories, proteins, carbs, fats FROM meals WHERE user_id = $1 AND meal_date = CURRENT_DATE',
      [userId]
    );

    // Retourne la liste des repas du jour
    return res.status(200).json({ meals: meals.rows });
  } catch (err) {
    console.error(err); // Affiche l'erreur pour le développeur
    res.status(500).json({ message: 'Erreur serveur.' }); // Message générique pour l'utilisateur
  }
};

// 🔵 POST : Ajouter un repas pour un utilisateur
exports.addMeal = async (req, res) => {
  const { email } = req.params; // Email de l'utilisateur depuis l'URL
  const { meal_type, calories, proteins, carbs, fats } = req.body; // Données du repas envoyées dans le corps de la requête

  // Vérifie que les champs obligatoires sont bien fournis
  if (!meal_type || !calories) {
    return res.status(400).json({ message: 'Données repas manquantes.' });
  }

  try {
    // Recherche l'utilisateur pour obtenir son ID
    const user = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    const userId = user.rows[0].id;

    // Insère un nouveau repas dans la base de données
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
