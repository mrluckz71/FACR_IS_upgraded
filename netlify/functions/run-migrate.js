const { pool } = require('./db');

exports.handler = async (event) => {
  // Protect with a secret header
  const secret = process.env.MIGRATE_SECRET;
  const token = (event.headers && (event.headers['x-migrate-token'] || event.headers['X-Migrate-Token'])) || null;

  if (!secret || token !== secret) {
    return {
      statusCode: 401,
      body: JSON.stringify({ ok: false, message: 'Unauthorized or MIGRATE_SECRET not set' })
    };
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT,
        surname TEXT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        photo TEXT,
        created_at TIMESTAMPTZ DEFAULT now()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS articles (
        id TEXT PRIMARY KEY,
        user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
        title TEXT,
        email TEXT,
        content TEXT,
        date TEXT,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ
      );
    `);

    await client.query('COMMIT');
    return { statusCode: 200, body: JSON.stringify({ ok: true, message: 'Migration complete' }) };
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration error', err);
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: String(err) }) };
  } finally {
    client.release();
  }
};
