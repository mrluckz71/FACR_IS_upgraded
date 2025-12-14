const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../../data/article_database.json');

// Read database
function readDatabase() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading articles database:', error);
    return [];
  }
}

// Save database
function saveDatabase(db) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving articles database:', error);
    return false;
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
function deleteAllArticles() {
  saveDatabase([]);
  return true;
}

// Get user's articles
function getUserArticles(userId) {
  const db = readDatabase();
  return db.filter(article => article.user_id === userId);
}

// Generate unique ID
function generateId() {
  return Math.random().toString(16).substr(2, 9);
}

module.exports = {
  readDatabase,
  saveDatabase,
  getArticle,
  getArticles,
  addArticle,
  editArticle,
  deleteArticle,
  deleteAllArticles,
  getUserArticles,
  generateId
};
