# Firebase Setup Guide for FACR IS

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Enter project name: `facr-is` (or your choice)
4. Click **Continue** through all steps
5. Click **Create project**

## Step 2: Set Up Realtime Database

1. In Firebase Console, go to **Build → Realtime Database**
2. Click **Create Database**
3. Choose **Start in test mode** (for development)
4. Select region closest to you
5. Click **Enable**

You'll get a database URL like: `https://your-project.firebaseio.com`

## Step 3: Get Service Account Credentials

1. Go to **Project Settings** (gear icon, top-right)
2. Click **Service Accounts** tab
3. Click **Generate New Private Key**
4. Save the JSON file (keep it safe!)
5. Open the JSON and copy these values:

```json
{
  "type": "service_account",
  "project_id": "YOUR_PROJECT_ID",
  "private_key_id": "YOUR_PRIVATE_KEY_ID",
  "private_key": "YOUR_PRIVATE_KEY",
  "client_email": "YOUR_CLIENT_EMAIL",
  "client_id": "YOUR_CLIENT_ID",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "YOUR_CERT_URL"
}
```

## Step 4: Add Environment Variables to Netlify

1. Go to your Netlify Site Dashboard
2. **Site settings → Build & deploy → Environment**
3. Click **Add a variable**
4. Add these environment variables from your service account JSON:

```
FIREBASE_PROJECT_ID = your_project_id
FIREBASE_PRIVATE_KEY_ID = your_private_key_id
FIREBASE_PRIVATE_KEY = your_private_key
FIREBASE_CLIENT_EMAIL = your_client_email
FIREBASE_CLIENT_ID = your_client_id
FIREBASE_AUTH_URI = https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI = https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_CERT_URL = https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_CERT_URL = your_cert_url
FIREBASE_DATABASE_URL = https://your-project.firebaseio.com
```

**⚠️ Important:** Keep `FIREBASE_PRIVATE_KEY` secure! Never commit it to GitHub.

### Getting FIREBASE_DATABASE_URL
1. In Firebase → Realtime Database
2. Copy the URL from the top (looks like: `https://your-project.firebaseio.com`)

## Step 5: Set Netlify Build Settings

1. In Netlify Site Settings: **Build & deploy → Build settings**
2. Ensure:
   - **Build command:** `npm install`
   - **Functions directory:** `netlify/functions`
   - **Publish directory:** `public`

## Step 6: Deploy with Firebase

1. Make sure all files are committed:
```bash
git add -A
git commit -m "Add Firebase integration"
git push origin main
```

2. Netlify will auto-deploy
3. Check **Deploys** to see build status

## Step 7: Test Firebase Connection

Once deployed, test by:

1. Register a new account on your site
2. Check Firebase Console → Realtime Database
3. You should see a `users` folder with your account data
4. Try adding an article
5. Check the `articles` folder

## Firebase Database Structure

After using the app, your database will look like:

```
{
  "users": {
    "abc123def456": {
      "id": "abc123def456",
      "name": "John",
      "surname": "Doe",
      "email": "john@example.com",
      "password": "$2y$10$...",
      "photo": "",
      "createdAt": "2025-12-14T10:30:00.000Z"
    }
  },
  "articles": {
    "xyz789abc123": {
      "id": "xyz789abc123",
      "user_id": "abc123def456",
      "title": "My Article",
      "email": "john@example.com",
      "content": "Article content here...",
      "date": "2025-12-14",
      "createdAt": "2025-12-14T10:35:00.000Z"
    }
  }
}
```

## Troubleshooting

### "Cannot read property 'once' of undefined"
- Check that environment variables are set in Netlify
- Redeploy: In Netlify → **Deploys → Trigger deploy**

### "FIREBASE_PRIVATE_KEY is undefined"
- Make sure `FIREBASE_PRIVATE_KEY` has the full key including newlines
- In Netlify env vars, paste the entire key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`

### Data not saving
- Check Firebase permissions: In Realtime Database → **Rules** should allow write
- Default test mode allows all reads/writes

### "No permission" error
- Check Firebase Rules: **Realtime Database → Rules**
- For testing, use:
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```
⚠️ Change this for production!

## Security Rules for Production

Once live, change your Firebase rules to:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "articles": {
      "$articleId": {
        ".read": true,
        ".write": "root.child('users').child(auth.uid).exists()"
      }
    }
  }
}
```

## Local Testing

To test Firebase locally:

1. Create `.env.local` file (not tracked by Git)
2. Add the same Firebase variables
3. Run: `netlify dev`

## Upgrade to Paid Plan

Firebase free tier includes:
- ✅ 100 concurrent connections
- ✅ 1GB storage
- ✅ 100GB download/month

If you exceed these, you'll be notified. Billing is pay-as-you-go.

## Migrating from JSON Files

Your existing data in `data/database.json` and `data/article_database.json` is not automatically migrated. You can:

1. **Manual Migration:** Use Firebase Console to add data
2. **Script Migration:** Create a Node.js script to import
3. **Fresh Start:** Users register new accounts

---

**Firebase is now live with your Netlify deployment!** 🎉
