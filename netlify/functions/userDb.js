const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_FILE = path.join(__dirname, '../../data/database.json');

// Read database
function readDatabase() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return {};
  }
}

// Save database
function saveDatabase(db) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving database:', error);
    return false;
  }
}

// Get user by email
function getUser(email) {
  const db = readDatabase();
  for (const key in db) {
    if (db[key].email === email) {
      return db[key];
    }
  }
  return null;
}

// Add new user
function addUser(email, name, surname, password, photo) {
  const db = readDatabase();
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newId = Math.max(0, ...Object.keys(db).map(Number)) + 1;
  
  db[newId] = {
    id: generateId(),
    name,
    surname,
    email,
    password: hashedPassword,
    photo
  };
  
  saveDatabase(db);
  return db[newId];
}

// Get all users
function getAllUsers() {
  return readDatabase();
}

// Generate unique ID (similar to PHP uniqid)
function generateId() {
  return Math.random().toString(16).substr(2, 9);
}

module.exports = { readDatabase, saveDatabase, getUser, addUser, getAllUsers, generateId };
