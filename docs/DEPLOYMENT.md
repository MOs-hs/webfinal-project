# Deployment Guide

## Deploy to Render (Recommended - Free)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Initial commit - Healthy Meal Planner"
git remote add origin https://github.com/YOUR_USERNAME/healthy-meal-planner.git
git push -u origin main
```

### Step 2: Create MySQL Database on Render
1. Go to https://render.com
2. Create New → PostgreSQL (or use external MySQL service like PlanetScale)
3. Copy the database connection details

### Step 3: Deploy Backend
1. On Render Dashboard → New → Web Service
2. Connect your GitHub repository
3. Configure:
   - **Name**: healthy-meal-planner-api
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Environment Variables**:
     - `DB_HOST`: your_db_host
     - `DB_USER`: your_db_user
     - `DB_PASSWORD`: your_db_password
     - `DB_NAME`: healthy_meal_planner
     - `JWT_SECRET`: random_secure_string
     - `PORT`: 5000

4. Click "Create Web Service"

### Step 4: Import Database
Use Render's MySQL console or external tool to import `database.sql`

Your API will be live at: `https://your-app-name.onrender.com`

---

## Deploy to Railway (Alternative)

### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
railway login
```

### Step 2: Initialize Railway
```bash
cd backend
railway init
```

### Step 3: Add MySQL Plugin
```bash
railway add mysql
```

### Step 4: Set Environment Variables
```bash
railway variables set JWT_SECRET=your_secret_here
```

### Step 5: Deploy
```bash
railway up
```

---

## Environment Variables for Production

Make sure to set these in your deployment platform:

```
DB_HOST=your_production_db_host
DB_USER=your_production_db_user
DB_PASSWORD=your_secure_password
DB_NAME=healthy_meal_planner
JWT_SECRET=very_long_random_secure_string
PORT=5000
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
```

---

## Testing Deployed API

Replace `localhost:5000` with your deployed URL:

```
GET https://your-app.onrender.com/api/meals
```

---

## Common Deployment Issues

### Database connection fails
- Check firewall settings
- Verify environment variables are set correctly
- Ensure database allows external connections

### CORS errors
- CORS is already configured in `app.js`
- Make sure frontend URL is allowed

### JWT errors
- Ensure JWT_SECRET is the same across deployments
- Check token expiration settings
