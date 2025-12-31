# QUICK DEPLOYMENT GUIDE - 1 HOUR SETUP

Choose **ONE** option below. Both work - pick whichever you're more comfortable with.

---

## OPTION 1: RENDER (Backend + PostgreSQL)

### Step 1: Create PostgreSQL Database (3 min)
1. Go to [render.com](https://render.com) → **New** → **PostgreSQL**
2. Name: `meal-planner-db`, Region: `Oregon`, Click **Create**
3. Copy **Internal Database URL** (starts with `postgresql://`)

### Step 2: Run Schema (2 min)
1. On database page, click **Connect** → Copy the PSQL command
2. Run in your terminal (needs PostgreSQL installed):
   ```bash
   # Paste the PSQL command from Render
   # Then paste contents of backend/database-postgres.sql
   ```
   OR use TablePlus/DBeaver with External URL

### Step 3: Deploy Backend (5 min)
1. Render → **New** → **Web Service** → Connect GitHub repo
2. Settings:
   - Name: `meal-planner-backend`
   - Root Directory: `backend`
   - Build: `npm install`
   - Start: `npm start`
   
3. **Environment Variables**:
   ```
   DATABASE_URL=<paste-internal-database-url>
   NODE_ENV=production
   JWT_SECRET=supersecretkey123
   PORT=10000
   FRONTEND_URL=https://your-app.netlify.app
   ```

4. Click **Create** → Wait for deploy → Copy your backend URL

---

## OPTION 2: RAILWAY (Backend + MySQL)

### Step 1: Create MySQL Database (2 min)
1. Go to [railway.app](https://railway.app) → **New Project**
2. Click **+ New** → **Database** → **MySQL**
3. Click on MySQL service → **Variables** tab
4. Note: `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`

### Step 2: Run Schema (2 min)
1. Click **Data** tab in Railway MySQL service
2. Click **Query** → Paste contents of `backend/database.sql`
3. Click Run

### Step 3: Deploy Backend (5 min)
1. Railway → **+ New** → **GitHub Repo** → Select your repo
2. Settings → **Root Directory**: `backend`
3. **Environment Variables** (Add these):
   ```
   DB_HOST=${{MySQL.MYSQL_HOST}}
   DB_USER=${{MySQL.MYSQL_USER}}
   DB_PASSWORD=${{MySQL.MYSQL_PASSWORD}}
   DB_NAME=${{MySQL.MYSQL_DATABASE}}
   JWT_SECRET=supersecretkey123
   PORT=5000
   FRONTEND_URL=https://your-app.netlify.app
   ```

4. Railway auto-deploys → Copy your backend URL

**IMPORTANT**: You need to change `backend/src/config/db.js` for MySQL:

```javascript
import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to MySQL database');
});

export default db;
```

---

## DEPLOY FRONTEND (BOTH OPTIONS - 5 min)

1. Go to [netlify.com](https://netlify.com) → **Add site** → **Import from Git**
2. Select your repo
3. Settings:
   - Base directory: `client`
   - Build: `npm run build`
   - Publish: `client/dist`

4. **Environment Variable**:
   ```
   VITE_API_URL=<paste-your-backend-url>
   ```

5. Deploy → Then **Trigger redeploy**

---

## UPDATE BACKEND WITH FRONTEND URL

Go back to Render/Railway → Update `FRONTEND_URL` with your Netlify URL → Redeploy

---

## TESTING (2 min)

✅ Backend: Visit `https://your-backend-url/` → Should see welcome message  
✅ Frontend: Visit Netlify URL → Register account → Test features

---

## TROUBLESHOOTING

**Backend won't start:**
- Check logs for database connection errors
- Verify all environment variables are set
- For Railway: Make sure MySQL service is linked
- For Render: Use INTERNAL database URL

**Frontend can't connect:**
- Verify `VITE_API_URL` is set in Netlify
- Redeploy after adding env variable
- Check backend CORS allows your Netlify domain

**Database connection timeout:**
- Render: Use Internal URL, not External
- Railway: Check MySQL variables reference the service correctly

---

## FASTEST PATH RECOMMENDATION

**If you have PostgreSQL installed locally**: Use Render (easier to run schema)  
**If you don't**: Use Railway (can run schema in web UI)

Both will work - just pick one and go!
