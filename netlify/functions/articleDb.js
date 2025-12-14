const { query, generateId } = require('./db');

// Get single article by ID
async function getArticle(id) {
  try {
    const res = await query('SELECT * FROM articles WHERE id = $1 LIMIT 1', [id]);
    return res.rows[0] || null;
  } catch (err) {
    console.error('getArticle error', err);
    throw err;
  }
}

// Get all articles (newest first)
async function getArticles() {
  try {
    const res = await query('SELECT * FROM articles ORDER BY created_at DESC');
    return res.rows;
  } catch (err) {
    console.error('getArticles error', err);
    throw err;
  }
}

// Add new article
async function addArticle(userId, title, email, content, date) {
  try {
    const id = generateId();
    const createdAt = new Date().toISOString();
    const res = await query(
      'INSERT INTO articles(id, user_id, title, email, content, date, created_at) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [id, userId, title, email, content, date || null, createdAt]
    );
    return res.rows[0];
  } catch (err) {
    console.error('addArticle error', err);
    throw err;
  }
}

// Edit article
async function editArticle(id, title, content) {
  try {
    const updatedAt = new Date().toISOString();
    const res = await query(
      'UPDATE articles SET title=$1, content=$2, updated_at=$3 WHERE id=$4 RETURNING *',
      [title, content, updatedAt, id]
    );
    return res.rows[0] || null;
  } catch (err) {
    console.error('editArticle error', err);
    throw err;
  }
}

// Delete article
async function deleteArticle(id) {
  try {
    const res = await query('DELETE FROM articles WHERE id=$1 RETURNING id', [id]);
    return res.rowCount > 0;
  } catch (err) {
    console.error('deleteArticle error', err);
    throw err;
  }
}

// Delete all articles
async function deleteAllArticles() {
  try {
    await query('DELETE FROM articles');
    return true;
  } catch (err) {
    console.error('deleteAllArticles error', err);
    throw err;
  }
}

// Get all articles for a specific user
async function getUserArticles(userId) {
  try {
    const res = await query('SELECT * FROM articles WHERE user_id=$1 ORDER BY created_at DESC', [userId]);
    return res.rows;
  } catch (err) {
    console.error('getUserArticles error', err);
    throw err;
  }
}

module.exports = {
  getArticle,
  getArticles,
  addArticle,
  editArticle,
  deleteArticle,
  deleteAllArticles,
  getUserArticles,
};
