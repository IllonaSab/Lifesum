// db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',       // ton utilisateur PostgreSQL
  host: 'localhost',      // ou autre si tu es sur Supabase ou un autre hébergeur
  database: 'lifesum_db',    // nom de ta base
  password: 'Illona55',
  port: 5432,
});

module.exports = pool;
