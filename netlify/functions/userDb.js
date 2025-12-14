const bcrypt = require('bcryptjs');
const { query, generateId } = require('./db');

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

// Get all users
async function getAllUsers() {
  try {
    const res = await query('SELECT * FROM users ORDER BY created_at DESC');
    return res.rows;
  } catch (err) {
    console.error('getAllUsers error', err);
    throw err;
  }
}

// Get user by ID
async function getUserById(userId) {
  try {
    const res = await query('SELECT * FROM users WHERE id = $1 LIMIT 1', [userId]);
    return res.rows[0] || null;
  } catch (err) {
    console.error('getUserById error', err);
    throw err;
  }
}

// Update user
async function updateUser(userId, userData) {
  try {
    const fields = [];
    const values = [];
    let idx = 1;
    for (const key in userData) {
      if (key !== 'id') {
        fields.push(`${key} = $${idx}`);
        values.push(userData[key]);
        idx++;
      }
    }
    values.push(userId);
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
    const res = await query(sql, values);
    return res.rows[0] || null;
  } catch (err) {
    console.error('updateUser error', err);
    throw err;
  }
}

// Delete all users
async function deleteAllUsers() {
  try {
    await query('DELETE FROM users');
    return true;
  } catch (err) {
    console.error('deleteAllUsers error', err);
    throw err;
  }
}

module.exports = { 
  getUser, 
  getUserById,
  addUser, 
  getAllUsers, 
  updateUser, 
  deleteAllUsers 
};
