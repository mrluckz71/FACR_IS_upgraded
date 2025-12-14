const { pool } = require('./db');

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Create users table
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

    // Create articles table
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
    console.log('Migration complete');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration failed', err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

migrate();
