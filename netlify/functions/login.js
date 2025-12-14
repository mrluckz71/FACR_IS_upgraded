const bcrypt = require('bcryptjs');
const { getUser } = require('./userDb');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email and password are required' })
      };
    }

    const user = await getUser(email);
    
    if (!user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Email does not exist' })
      };
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);
    
    if (!passwordMatch) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid password' })
      };
    }

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        user: userWithoutPassword
      })
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error' })
    };
  }
};
