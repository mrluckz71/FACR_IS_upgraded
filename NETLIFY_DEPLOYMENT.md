# FACR IS - Netlify Deployment Guide

## Project Structure Conversion ✅

Your PHP project has been successfully converted to use **Netlify Functions** for the backend!

### What Changed

**OLD Structure (PHP Backend):**
```
├── login.php
├── register.php
├── main.php
├── add_article.php
├── func/
│   ├── _article_database_func.php
│   └── user_database_func.php
└── includes/ (header, nav, footer)
```

**NEW Structure (Serverless API + Frontend):**
```
├── public/                      # All frontend files
│   ├── index.html              # Home page
│   ├── login.html              # Login form
│   ├── register.html           # Registration form
│   ├── articles.html           # Articles list
│   ├── add-article.html        # Add article form
│   ├── edit-article.html       # Edit article form
│   ├── my-articles.html        # User's articles
│   ├── article-detail.html     # Article detail view
│   ├── profile.html            # User profile
│   ├── about.html              # About page
│   ├── contact.html            # Contact page
│   ├── api.js                  # API client library
│   ├── header.html             # Header component
│   ├── nav.html                # Navigation component
│   ├── styles/                 # Stylesheets
│   └── img/                    # Images
├── netlify/
│   └── functions/              # Serverless functions
│       ├── login.js            # Login endpoint
│       ├── register.js         # Register endpoint
│       ├── articles.js         # Articles API
│       ├── userDb.js           # User database utilities
│       └── articleDb.js        # Article database utilities
├── data/
│   ├── database.json           # User database
│   └── article_database.json   # Articles database
├── netlify.toml                # Netlify configuration
└── package.json                # Node dependencies
```

## API Endpoints

All requests go to `/api/` prefix:

### Authentication
- **POST** `/api/login` - Login user
  - Body: `{ email, password }`
  - Response: `{ success, user }`

- **POST** `/api/register` - Register new user
  - Body: `{ email, name, surname, password, password2, photo }`
  - Response: `{ success, user }`

### Articles
- **GET** `/api/articles` - Get all articles
  - Response: `{ articles: [...] }`

- **GET** `/api/articles?id=xxx` - Get single article
  - Response: `{ article: {...} }`

- **GET** `/api/articles?userId=xxx` - Get user's articles
  - Response: `{ articles: [...] }`

- **POST** `/api/articles` - Create article
  - Body: `{ userId, title, email, content, date }`
  - Response: `{ article: {...} }`

- **PUT** `/api/articles` - Edit article
  - Body: `{ id, title, content }`
  - Response: `{ success }`

- **DELETE** `/api/articles?id=xxx` - Delete article
  - Response: `{ success }`

## Session Management

Sessions are stored in **localStorage** instead of PHP sessions:

```javascript
// Check if user is logged in
if (Session.isLoggedIn()) {
  console.log(Session.user);    // Get user data
  console.log(Session.userId);   // Get user ID
  console.log(Session.userEmail); // Get user email
}

// Logout
logout();  // Clears localStorage and redirects
```

## Deployment Steps

### Step 1: Connect to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Sign in with GitHub
3. Click **"New site from Git"**
4. Select your **mrluckz71/FACR_IS_upgraded** repository
5. Click **"Deploy site"**

### Step 2: Automatic Configuration
Netlify automatically reads `netlify.toml` which includes:
- **Build command:** `npm install`
- **Publish directory:** `public`
- **Functions directory:** `netlify/functions`
- **Redirects:** API routes and SPA routing

### Step 3: Verify Deployment
Once deployed, you'll get a URL like: `https://your-site.netlify.app`

Test the site:
1. Go to login page
2. Try to register a new account
3. Log in
4. Add an article
5. View your articles

## Environment Variables (Optional)

If you need to add environment variables:

1. In Netlify dashboard: **Site settings → Build & deploy → Environment**
2. Add variables like: `API_BASE_URL`, `DATABASE_PATH`, etc.
3. Access in functions: `process.env.VARIABLE_NAME`

## Troubleshooting

### API Calls Return 404
- Check that `netlify.toml` is in the root directory
- Ensure functions are in `netlify/functions/` folder
- Redeploy: In Netlify dashboard, go to **Deploys → Trigger deploy**

### Sessions Not Persisting
- The app uses `localStorage` - check browser's Application tab
- Clear cache if needed: **Cmd+Shift+Delete** (Windows) or **Cmd+Shift+Delete** (Mac)

### Data Not Saving
- Ensure `data/database.json` and `data/article_database.json` exist locally
- These are tracked by Git - commit them first
- File permissions should be writable by Node.js

### CORS Issues
- The app is single-origin, so CORS shouldn't be an issue
- If issues occur, add CORS headers in Netlify Functions

## Local Development

To test locally before deploying:

```bash
# Install dependencies
npm install

# Install Netlify CLI
npm install -g netlify-cli

# Start local server with functions
netlify dev

# Visit http://localhost:8888
```

## Frontend Architecture

All frontend files use a common pattern:

1. **Load includes** - Fetch `header.html` and `nav.html`
2. **Check auth** - Use `Session.isLoggedIn()`
3. **Load data** - Call API functions from `api.js`
4. **Render content** - Update DOM with data

Example:
```javascript
async function loadIncludes() {
  const headerRes = await fetch('header.html');
  document.getElementById('header').innerHTML = await headerRes.text();
}

document.addEventListener('DOMContentLoaded', loadIncludes);
```

## Data Persistence

Files are stored locally in `data/` folder:
- `database.json` - User accounts (hashed passwords)
- `article_database.json` - Articles

**Note:** For production use, consider migrating to:
- Firebase Realtime Database
- MongoDB Atlas
- PostgreSQL
- AWS DynamoDB

## Security Notes

✅ Implemented:
- Password hashing (bcryptjs)
- Email validation
- Name validation
- CSRF token handling

⚠️ Consider for Production:
- HTTPS enforcement
- Rate limiting
- Input sanitization
- SQL injection prevention
- XSS protection
- JWT tokens for API
- Password recovery system

## Support

For more info:
- Netlify Docs: https://docs.netlify.com
- Netlify Functions: https://docs.netlify.com/functions/overview/
- GitHub: https://github.com/mrluckz71/FACR_IS_upgraded

---

**Status:** ✅ Ready for Netlify deployment!
