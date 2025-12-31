# Deployment Guide: Render (Backend + Database) + Netlify

## Overview

This guide covers deploying the Healthy Meal Planner application with:
- **Backend**: Render Web Service
- **Database**: Render Managed PostgreSQL
- **Frontend**: Netlify

This architecture ensures stable internal networking between backend and database.

---

## Part 1: Set Up Render PostgreSQL Database

### 1. Create PostgreSQL Database

1. Go to [render.com](https://render.com/login) and sign in
2. Click **New** → **PostgreSQL**
3. Configure:
   - **Name**: `healthy-meal-planner-db`
   - **Database**: `healthy_meal_planner`
   - **User**: (auto-generated)
   - **Region**: Choose same as your backend (e.g., Oregon)
   - **Plan**: Free tier
4. Click **Create Database**
5. Wait for provisioning (~2 minutes)

### 2. Get Database Connection String

Once created, scroll down to **Connections**:
- Copy the **Internal Database URL** (starts with `postgresql://`)
- This URL has the format: `postgresql://user:password@hostname:5432/database`

> [!IMPORTANT]
> Use the **Internal Database URL**, not the External one. Internal URLs enable faster, private networking.

### 3. Run Database Schema

You need to execute the PostgreSQL schema to create tables and sample data.

**Option A: Using Render PSQL Console (Recommended)**
1. On your database page, click **Connect** → **PSQL Command**
2. Copy the command (looks like: `PSQL postgresql://user:pass@host/db`)
3. Run it in your local terminal (requires PostgreSQL client installed)
4. Once connected, paste and execute the contents of `backend/database-postgres.sql`
5. Verify tables were created: `\dt`
6. Exit: `\q`

**Option B: Using External Connection**
1. Use a PostgreSQL client like TablePlus, pgAdmin, or DBeaver
2. Connect using the **External Database URL**
3. Run the SQL script from `backend/database-postgres.sql`

---

## Part 2: Deploy Backend to Render

### 1. Create Web Service

1. In Render dashboard, click **New** → **Web Service**
2. Connect your GitHub repo: `MOs-hs/webfinal-project`
3. Configure:
   - **Name**: `healthy-meal-planner-backend`
   - **Region**: Same as database (e.g., Oregon)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free tier

### 2. Configure Environment Variables

Click **Advanced** → **Add Environment Variables**:

```
DATABASE_URL=<paste-internal-database-url>
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=10000
FRONTEND_URL=https://your-app.netlify.app
```

> [!WARNING]
> Replace `<paste-internal-database-url>` with the actual Internal Database URL you copied earlier.
> Change `JWT_SECRET` to a strong random string.
> Update `FRONTEND_URL` after deploying frontend.

### 3. Deploy

1. Click **Create Web Service**
2. Render will build and deploy automatically
3. Monitor logs for: `✅ Connected to PostgreSQL database`
4. If successful, you'll see: `🚀 Server running on http://localhost:10000`
5. Copy your backend URL (e.g., `https://healthy-meal-planner-backend.onrender.com`)

---

## Part 3: Deploy Frontend to Netlify

### 1. Deploy Site

1. Go to [netlify.com](https://netlify.com) and sign in
2. Click **Add new site** → **Import an existing project** → **GitHub**
3. Select your repo: `MOs-hs/webfinal-project`
4. Configure:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/dist`
5. Click **Deploy**

### 2. Configure Environment Variables

After initial deploy:
1. Go to **Site settings** → **Environment variables**
2. Click **Add a variable**:
   ```
   VITE_API_URL=https://your-render-backend-url.onrender.com
   ```
3. Replace with your actual Render backend URL
4. Go to **Deploys** → **Trigger deploy** → **Clear cache and deploy**

---

## Part 4: Final Configuration

### Update Backend FRONTEND_URL

1. Go back to Render backend service
2. Navigate to **Environment** tab
3. Update `FRONTEND_URL` with your Netlify URL
4. Save changes (will auto-redeploy)

---

## Testing Your Deployment

### Backend Health Check
Visit: `https://your-backend-url.onrender.com/`

Expected response:
```json
{"message":"Welcome to Healthy Meal Planner API"}
```

### Database Connection
Check your Render backend logs for:
```
✅ Connected to PostgreSQL database
🚀 Server running on http://localhost:10000
```

### Frontend
1. Visit your Netlify URL
2. You should see the login/register page
3. Register a new account
4. Test creating meals, meal plans, etc.

---

## Troubleshooting

### Backend shows "Database connection failed"
- ✅ Verify `DATABASE_URL` is set correctly in Render environment variables
- ✅ Ensure you used the **Internal Database URL**, not External
- ✅ Check that database schema was executed successfully
- ✅ Verify database and backend are in the same region

### Frontend can't connect to backend
- ✅ Check `VITE_API_URL` is set in Netlify environment variables
- ✅ Ensure you redeployed after adding the variable
- ✅ Verify backend URL is correct (no trailing slash)
- ✅ Check CORS settings allow your Netlify domain

### CORS errors
- ✅ Verify `FRONTEND_URL` in Render matches your Netlify URL exactly
- ✅ No trailing slashes in URLs
- ✅ Both HTTP and HTTPS should match

---

## Important Notes

> [!CAUTION]
> **Free Tier Limitations**
> - Render free tier services spin down after 15 minutes of inactivity
> - First request after spin-down may take 30-50 seconds
> - Database has 90-day expiration on free tier
> - 750 hours/month limit for free web services

> [!TIP]
> **Sample Data Passwords**
> The sample users have placeholder password hashes. Either:
> - Generate proper bcrypt hashes and update the SQL
> - Or simply register new users through the application

---

## Architecture Benefits

✅ **Stable Connection**: Backend and database on same platform = no cross-provider network issues  
✅ **Internal Networking**: Internal Database URL = faster, more reliable connections  
✅ **Industry Standard**: PostgreSQL is production-grade, ACID-compliant  
✅ **Professional Setup**: Follows cloud deployment best practices  

This setup eliminates the `ETIMEDOUT` and connection errors from cross-platform deployments.
