const { addUser, getUser } = require('./userDb');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { email, name, surname, password, password2, photo } = JSON.parse(event.body);

    // Validation
    if (!email || !name || !surname || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'All fields are required' })
      };
    }

    if (!isValidEmail(email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid email format' })
      };
    }

    if (password.length < 8) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Password must be at least 8 characters' })
      };
    }

    if (password !== password2) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Passwords do not match' })
      };
    }

    if (!isValidName(name) || !isValidName(surname)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Name and surname must contain only letters' })
      };
    }

    // Check if user already exists
    const existingUser = await getUser(email);
    if (existingUser) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email already exists' })
      };
    }

    // Add user
    const newUser = await addUser(email, name, surname, password, photo || '');
    const { password: _, ...userWithoutPassword } = newUser;

    return {
      statusCode: 201,
      body: JSON.stringify({
        success: true,
        message: 'User registered successfully',
        user: userWithoutPassword
      })
    };
  } catch (error) {
    console.error('Register error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error' })
    };
  }
};

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function isValidName(name) {
  const re = /^[A-Za-zÁáČčĎďÉéĚěÍíŇňÓóŘřŠšŤťÚúŮůÝýŽž]+$/;
  return re.test(name);
}
