# Deployment Guide: Railway + Netlify

## Quick Start

Your project is now ready for deployment! Follow these steps:

---

## Step 1: Deploy Backend to Railway

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your `healthy-meal-planner` repo
4. Railway will auto-detect the `backend` folder - if not, set **Root Directory** to `backend`
5. Go to **Variables** tab and add:

```
PORT=5000
DB_HOST=your-mysql-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=healthy_meal_planner
JWT_SECRET=your-secret-key-here
FRONTEND_URL=https://your-app.netlify.app
```

6. Railway will give you a URL like `https://your-app.up.railway.app` - **copy this**

---

## Step 2: Deploy Frontend to Netlify

1. Go to [netlify.com](https://netlify.com) and sign in
2. Click **Add new site** → **Import an existing project** → **GitHub**
3. Select your repo
4. Set **Base directory** to `client`
5. Build command: `npm run build`
6. Publish directory: `client/dist`
7. Click **Deploy site**

8. After deploy, go to **Site settings** → **Environment variables** → Add:
```
VITE_API_URL=https://your-railway-backend-url.up.railway.app
```

9. **Trigger a redeploy** for the env variable to take effect

---

## Step 3: Update Railway with Netlify URL

Go back to Railway and update the `FRONTEND_URL` variable with your actual Netlify URL.

---

## Files Created for Deployment

| File | Purpose |
|------|---------|
| `backend/Procfile` | Tells Railway how to start app |
| `client/netlify.toml` | Netlify build config + SPA routing |
| `client/src/config.js` | Centralized API URL from env |

---

## Testing After Deployment

1. Visit your Railway URL - should see `{"message":"Welcome to Healthy Meal Planner API"}`
2. Visit your Netlify URL - should see login page
3. Create account and test all features
