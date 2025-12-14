# FACR IS Upgraded - Serverless Edition

Modern serverless article management system running on Netlify Functions with PostgreSQL (Neon).

## 🚀 Architecture

- **Frontend**: Static HTML/CSS/JavaScript (in `/public`)
- **Backend**: Netlify Functions (serverless Node.js)
- **Database**: PostgreSQL via Neon
- **Styling**: Modern 2025 design conventions

## 📋 Features

- ✅ User registration & login with bcryptjs password hashing
- ✅ Create, edit, delete articles
- ✅ User-specific article management
- ✅ Email validation (AJAX)
- ✅ Pagination support
- ✅ Responsive modern UI
- ✅ Session management via localStorage

## 🛠️ Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL database (or Neon account)
- Netlify CLI

### Setup

1. **Clone & install**
```bash
git clone https://github.com/mrluckz71/FACR_IS_upgraded
cd FACR_IS_upgraded
npm install
```

2. **Create .env file** (copy from .env.example)
```bash
cp .env.example .env
```

3. **Configure DATABASE_URL**
   - Get PostgreSQL connection string from Neon
   - Add to `.env`: `DATABASE_URL=postgresql://user:password@host/database`

4. **Run migrations** (one time)
```bash
netlify dev
# In another terminal:
curl -X POST http://localhost:8888/.netlify/functions/run-migrate \
  -H "x-migrate-token: your_migrate_secret"
```

5. **Start development server**
```bash
netlify dev
```

Access at `http://localhost:8888`

## 📦 Netlify Deployment

### 1. Push to GitHub
```bash
git add .
git commit -m "Initial serverless setup"
git push origin main
```

### 2. Connect to Netlify
- Go to [netlify.com](https://netlify.com)
- Click **New site from Git**
- Select your GitHub repo
- Deploy!

### 3. Add Environment Variables
In Netlify Dashboard → Site settings → Build & deploy → Environment:

```
DATABASE_URL=postgresql://user:password@host/database
MIGRATE_SECRET=your_secret_token_here
```

### 4. Run Migrations
First deployment will auto-create the database schema via `migrate.js`.

To manually trigger migration:
```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/run-migrate \
  -H "x-migrate-token: your_secret_token_here"
```

## 📁 Project Structure

```
FACR_IS_upgraded/
├── public/               # Frontend (static HTML/CSS/JS)
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── articles.html
│   ├── add-article.html
│   ├── api.js           # API client library
│   └── styles/
├── netlify/
│   └── functions/       # Serverless functions
│       ├── db.js        # PostgreSQL client
│       ├── userDb.js    # User operations
│       ├── articleDb.js # Article operations
│       ├── login.js     # Login endpoint
│       ├── register.js  # Registration endpoint
│       ├── articles.js  # Article CRUD endpoint
│       ├── check-email.js # Email validation
│       ├── migrate.js   # Database schema
│       ├── run-migrate.js # Protected migration endpoint
│       └── utils.js     # Helper functions
├── data/                # Database backups (local dev only)
├── package.json         # Dependencies
├── .env.example         # Environment template
├── netlify.toml         # Netlify configuration
└── README.md            # This file
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name VARCHAR(255),
  surname VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT,
  photo TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Articles Table
```sql
CREATE TABLE articles (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  title VARCHAR(255),
  email VARCHAR(255),
  content TEXT,
  date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔌 API Endpoints

### Authentication
- `POST /.netlify/functions/login` - Login user
- `POST /.netlify/functions/register` - Register new user
- `GET /.netlify/functions/check-email?email=...` - Validate email availability

### Articles
- `GET /.netlify/functions/articles` - Get all articles
- `POST /.netlify/functions/articles` - Create article
- `PUT /.netlify/functions/articles` - Edit article
- `DELETE /.netlify/functions/articles?id=...` - Delete article
- `GET /.netlify/functions/articles?userId=...` - Get user articles

### Database
- `POST /.netlify/functions/run-migrate` - Create schema (requires token)

## 🔐 Security Notes

- Passwords hashed with bcryptjs (10 rounds)
- Migration endpoint protected by `MIGRATE_SECRET` token
- Session stored in browser localStorage
- SQL injection prevented via parameterized queries
- CORS headers configured in netlify.toml

## 🚀 Performance

- CDN edge caching for static files
- PostgreSQL connection pooling
- Minimal dependencies (bcryptjs, pg only)
- Cold start optimized

## 📝 Configuration Files

### netlify.toml
Routes all `/api/*` requests to functions, publishes `/public` folder.

### .env.example
Template for environment variables. Copy to `.env` for local dev.

## 🛠️ Troubleshooting

**"DATABASE_URL is not set"**
- Add to .env or Netlify environment variables
- Check variable name is exactly `DATABASE_URL`

**"Cannot find module 'pg'"**
- Run `npm install`
- Check node_modules exists

**"Migration failed"**
- Verify DATABASE_URL is correct
- Check database is accessible
- Run migration with correct MIGRATE_SECRET token

**"Email validation not working"**
- Check `/check-email.js` endpoint is deployed
- Verify database has users table

## 📚 Tech Stack

- **Language**: Node.js (JavaScript)
- **Hosting**: Netlify Functions
- **Database**: PostgreSQL (Neon)
- **Password Security**: bcryptjs
- **Frontend**: Vanilla JS + CSS3
- **Version Control**: Git + GitHub

## 🔄 Migration from Old System

This project migrates from:
- PHP backend → Netlify Functions (Node.js)
- JSON files → PostgreSQL database
- Session cookies → localStorage

Data migration available in `netlify/functions/migrate.js`

## 📄 License

ISC

## 👤 Author

Original FACR IS - Updated to serverless 2025 standards

---

**Ready to deploy?** Push to GitHub and connect to Netlify! 🚀
