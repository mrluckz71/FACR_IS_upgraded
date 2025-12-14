const { Pool } = require('pg');

// Read DATABASE_URL from env
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn('DATABASE_URL is not set. DB client will fail until it is provided.');
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function query(text, params) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  // console.log('executed query', { text, duration, rows: res.rowCount });
  return res;
}

async function getClient() {
  return pool.connect();
}

/**
 * Generate a unique ID (mimic PHP uniqid)
 * @returns {string} Unique ID
 */
function generateId() {
  const timestamp = Date.now().toString(16);
  const random = Math.random().toString(16).substring(2, 10);
  return (timestamp + random).substring(0, 13).padEnd(13, '0');
}

module.exports = { query, getClient, pool, generateId };
