const { db } = require('./firebase-config');

// Read all articles
async function readDatabase() {
  try {
    const { query } = require('./db');

    async function getArticle(id) {
      try {
        const res = await query('SELECT * FROM articles WHERE id = $1 LIMIT 1', [id]);
        return res.rows[0] || null;
      } catch (err) {
        console.error('getArticle error', err);
        throw err;
      }
    }

    async function getArticles() {
      try {
        const res = await query('SELECT * FROM articles ORDER BY created_at DESC');
        return res.rows;
      } catch (err) {
        console.error('getArticles error', err);
        throw err;
      }
    }

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

    async function editArticle(id, title, content) {
      try {
        const updatedAt = new Date().toISOString();
        const res = await query('UPDATE articles SET title=$1, content=$2, updated_at=$3 WHERE id=$4', [title, content, updatedAt, id]);
        return res.rowCount > 0;
      } catch (err) {
        console.error('editArticle error', err);
        throw err;
      }
    }

    async function deleteArticle(id) {
      try {
        const res = await query('DELETE FROM articles WHERE id=$1', [id]);
        return res.rowCount > 0;
      } catch (err) {
        console.error('deleteArticle error', err);
        throw err;
      }
    }

    async function deleteAllArticles() {
      try {
        await query('DELETE FROM articles');
        return true;
      } catch (err) {
        console.error('deleteAllArticles error', err);
        throw err;
      }
    }

    async function getUserArticles(userId) {
      try {
        const res = await query('SELECT * FROM articles WHERE user_id=$1 ORDER BY created_at DESC', [userId]);
        return res.rows;
      } catch (err) {
        console.error('getUserArticles error', err);
        throw err;
      }
    }

    function generateId() {
      return Math.random().toString(16).substr(2, 9);
    }

    module.exports = {
      getArticle,
      getArticles,
      addArticle,
      editArticle,
      deleteArticle,
      deleteAllArticles,
      getUserArticles,
      generateId
    };
    if (!article) return false;
    
    await db.ref(`articles/${id}`).update({
      title,
      content,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error editing article:', error);
    throw error;
  }
}

// Delete article
async function deleteArticle(id) {
  try {
    await db.ref(`articles/${id}`).remove();
    return true;
  } catch (error) {
    console.error('Error deleting article:', error);
    throw error;
  }
}

// Delete all articles
async function deleteAllArticles() {
  try {
    await db.ref('articles').remove();
    return true;
  } catch (error) {
    console.error('Error deleting all articles:', error);
    throw error;
  }
}

// Get user's articles
async function getUserArticles(userId) {
  try {
    const snapshot = await db.ref('articles').orderByChild('user_id').equalTo(userId).once('value');
    const data = snapshot.val() || {};
    return Array.isArray(data) ? data : Object.values(data);
  } catch (error) {
    console.error('Error getting user articles:', error);
    return [];
  }
}
