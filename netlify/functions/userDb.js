const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_FILE = path.join(__dirname, '../../data/database.json');

// Read database
function readDatabase() {
  const bcrypt = require('bcryptjs');
  const { db } = require('./firebase-config');

  // Read all users
  async function readDatabase() {
    try {
      const snapshot = await db.ref('users').once('value');
      return snapshot.val() || {};
    } catch (error) {
      console.error('Error reading database:', error);
      return {};
    }
  }

  // Get user by email
  async function getUser(email) {
    try {
      const snapshot = await db.ref('users').once('value');
      const users = snapshot.val() || {};
    
      for (const key in users) {
        if (users[key].email === email) {
          return users[key];
        }
      }
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  // Add new user
  async function addUser(email, name, surname, password, photo) {
    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const userId = generateId();
    
      const newUser = {
        id: userId,
        name,
        surname,
        email,
        password: hashedPassword,
        photo: photo || '',
        createdAt: new Date().toISOString()
      };

      await db.ref(`users/${userId}`).set(newUser);
      return newUser;
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  }

  // Get all users
  async function getAllUsers() {
    try {
      const snapshot = await db.ref('users').once('value');
      return snapshot.val() || {};
    } catch (error) {
      console.error('Error getting all users:', error);
      return {};
    }
  }

  // Update user
  async function updateUser(userId, userData) {
    try {
      await db.ref(`users/${userId}`).update(userData);
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Generate unique ID
  function generateId() {
    return Math.random().toString(16).substr(2, 9);
  }

  module.exports = { readDatabase, getUser, addUser, getAllUsers, updateUser, generateId };
