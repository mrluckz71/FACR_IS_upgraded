/**
 * API Client for FACR IS
 */

const API_BASE = '/api';

// Session management
class Session {
  static get user() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  static set user(userData) {
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
    }
  }

  static get userId() {
    return this.user?.id;
  }

  static get userEmail() {
    return this.user?.email;
  }

  static logout() {
    localStorage.removeItem('user');
  }

  static isLoggedIn() {
    return !!this.user;
  }
}

// Login API
async function login(email, password) {
  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    Session.user = data.user;
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

// Register API
async function register(email, name, surname, password, password2, photo) {
  try {
    const response = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, surname, password, password2, photo: '' })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    return data;
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
}

// Get all articles
async function getArticles() {
  try {
    const response = await fetch(`${API_BASE}/articles`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to get articles');
    }

    return data.articles || [];
  } catch (error) {
    console.error('Get articles error:', error);
    return [];
  }
}

// Get single article
async function getArticle(id) {
  try {
    const response = await fetch(`${API_BASE}/articles?id=${id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to get article');
    }

    return data.article;
  } catch (error) {
    console.error('Get article error:', error);
    throw error;
  }
}

// Get user's articles
async function getUserArticles(userId) {
  try {
    const response = await fetch(`${API_BASE}/articles?userId=${userId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to get user articles');
    }

    return data.articles || [];
  } catch (error) {
    console.error('Get user articles error:', error);
    return [];
  }
}

// Add article
async function addArticle(title, content) {
  try {
    if (!Session.isLoggedIn()) {
      throw new Error('User not logged in');
    }

    const response = await fetch(`${API_BASE}/articles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: Session.userId,
        title,
        email: Session.userEmail,
        content,
        date: new Date().toISOString()
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to add article');
    }

    return data.article;
  } catch (error) {
    console.error('Add article error:', error);
    throw error;
  }
}

// Edit article
async function editArticle(id, title, content) {
  try {
    const response = await fetch(`${API_BASE}/articles`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, title, content })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to edit article');
    }

    return data;
  } catch (error) {
    console.error('Edit article error:', error);
    throw error;
  }
}

// Delete article
async function deleteArticle(id) {
  try {
    const response = await fetch(`${API_BASE}/articles?id=${id}`, {
      method: 'DELETE'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete article');
    }

    return data;
  } catch (error) {
    console.error('Delete article error:', error);
    throw error;
  }
}

// Logout
function logout() {
  Session.logout();
  window.location.href = '/index.html';
}

// Validation helpers
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function isValidName(name) {
  const re = /^[A-Za-zÁáČčĎďÉéĚěÍíŇňÓóŘřŠšŤťÚúŮůÝýŽž]+$/;
  return re.test(name);
}

function isPasswordMatch(pwd1, pwd2) {
  return pwd1 === pwd2 && pwd1.length >= 8;
}
