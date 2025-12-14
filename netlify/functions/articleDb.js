const { db } = require('./firebase-config');

// Read all articles
async function readDatabase() {
  try {
    const snapshot = await db.ref('articles').once('value');
    const data = snapshot.val() || {};
    return Array.isArray(data) ? data : Object.values(data);
  } catch (error) {
    console.error('Error reading articles database:', error);
    return [];
  }
}

// Get article by ID
function getArticle(id) {
  const db = readDatabase();
  return db.find(article => article.id === id) || null;
}

// Get all articles
function getArticles() {
  return readDatabase();
}

// Add new article
function addArticle(userId, title, email, content, date) {
  const db = readDatabase();
  const newArticle = {
    id: generateId(),
    user_id: userId,
    title,
    email,
    content,
    date
  };
  db.push(newArticle);
  saveDatabase(db);
  return newArticle;
}

// Edit article
function editArticle(id, title, content) {
  const db = readDatabase();
  const article = db.find(a => a.id === id);
  if (article) {
    article.title = title;
    article.content = content;
    saveDatabase(db);
    return true;
  }
  return false;
}

// Delete article
function deleteArticle(id) {
  const db = readDatabase();
  const index = db.findIndex(a => a.id === id);
  if (index > -1) {
    db.splice(index, 1);
    saveDatabase(db);
    return true;
  }
  return false;
}

// Delete all articles
async function getArticle(id) {
  try {
    const snapshot = await db.ref(`articles/${id}`).once('value');
    return snapshot.val() || null;
  } catch (error) {
    console.error('Error getting article:', error);
    return null;
  }
}

// Get all articles
async function getArticles() {
  try {
    const snapshot = await db.ref('articles').once('value');
    const data = snapshot.val() || {};
    return Array.isArray(data) ? data : Object.values(data);
  } catch (error) {
    console.error('Error getting articles:', error);
    return [];
  }
}

// Add new article
async function addArticle(userId, title, email, content, date) {
  try {
    const articleId = generateId();
    const newArticle = {
      id: articleId,
      user_id: userId,
      title,
      email,
      content,
      date,
      createdAt: new Date().toISOString()
    };
    await db.ref(`articles/${articleId}`).set(newArticle);
    return newArticle;
  } catch (error) {
    console.error('Error adding article:', error);
    throw error;
  }
}

// Edit article
async function editArticle(id, title, content) {
  try {
    const article = await getArticle(id);
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
