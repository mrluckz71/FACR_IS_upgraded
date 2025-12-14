const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_FILE = path.join(__dirname, '../../data/database.json');

// Read database
const bcrypt = require('bcryptjs');
const { query } = require('./db');

// Get user by email
async function getUser(email) {
  try {
    const res = await query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
    return res.rows[0] || null;
  } catch (err) {
    console.error('getUser error', err);
    throw err;
  }
}

// Add new user
async function addUser(email, name, surname, password, photo) {
  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const id = generateId();
    const createdAt = new Date().toISOString();
    const res = await query(
      'INSERT INTO users(id, name, surname, email, password, photo, created_at) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [id, name, surname, email, hashedPassword, photo || '', createdAt]
    );
    return res.rows[0];
  } catch (err) {
    console.error('addUser error', err);
    throw err;
  }
}

async function getAllUsers() {
  try {
    const res = await query('SELECT * FROM users ORDER BY created_at DESC');
    return res.rows;
  } catch (err) {
    console.error('getAllUsers error', err);
    throw err;
  }
}

async function updateUser(userId, userData) {
  try {
    const fields = [];
    const values = [];
    let idx = 1;
    for (const key in userData) {
      fields.push(`${key} = $${idx}`);
      values.push(userData[key]);
      idx++;
    }
    values.push(userId);
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx}`;
    await query(sql, values);
    return true;
  } catch (err) {
    console.error('updateUser error', err);
    throw err;
  }
}

function generateId() {
  return Math.random().toString(16).substr(2, 9);
}

module.exports = { getUser, addUser, getAllUsers, updateUser, generateId };
  }
