// Check if email exists in database
const { query } = require('./db');

exports.handler = async (event, context) => {
  // Only accept GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const email = event.queryStringParameters?.email;

    // Validate email parameter
    if (!email || email.trim() === '') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email is not set' }),
      };
    }

    // Query the database for the email
    const res = await query('SELECT id FROM users WHERE email = $1 LIMIT 1', [email]);

    if (res.rows.length > 0) {
      // Email is taken
      return {
        statusCode: 200,
        body: JSON.stringify({ error: 'Email is already taken' }),
      };
    } else {
      // Email is available
      return {
        statusCode: 200,
        body: JSON.stringify({ error: '' }),
      };
    }
  } catch (err) {
    console.error('check-email error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error' }),
    };
  }
};
