const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query(
  'SELECT * FROM users WHERE LOWER(email) = LOWER($1)', 
  [email]
);
  const user = result.rows[0];

  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Identifiants incorrects.' });
  }

  // 🔐 Générer un token (exp. 24h)
  const token = jwt.sign({ email: user.email }, 'SECRET_KEY', { expiresIn: '24h' });

  res.json({ message: 'Connexion réussie', token });
};
