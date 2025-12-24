# XAMPP Setup Guide

## 🚀 Quick Setup with XAMPP

### Step 1: Start XAMPP Services
1. Open **XAMPP Control Panel**
2. Start **Apache** (optional, for future frontend)
3. Start **MySQL** ✅ (required)

### Step 2: Create Database Using phpMyAdmin
1. Open your browser and go to: `http://localhost/phpmyadmin`
2. Click **"New"** in the left sidebar
3. Database name: `healthy_meal_planner`
4. Click **"Create"**

### Step 3: Import Database Schema
1. Select the `healthy_meal_planner` database
2. Click **"Import"** tab
3. Click **"Choose File"**
4. Navigate to: `backend/database.sql`
5. Click **"Go"** at the bottom

You should see: ✅ "Import has been successfully finished"

### Step 4: Configure Backend for XAMPP
The default XAMPP MySQL settings are:
- **Host**: `localhost`
- **User**: `root`
- **Password**: `` (empty - no password by default)
- **Port**: `3306`

Edit `backend/.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=healthy_meal_planner

PORT=5000
JWT_SECRET=my_secret_key_12345
```

### Step 5: Install Dependencies and Run
```bash
cd backend
npm install
npm run dev
```

Server will start at: `http://localhost:5000`

---

## 🧪 Test Your Setup

### 1. Check Database Connection
Open phpMyAdmin and verify these tables exist:
- ✅ Users (with 2 sample users)
- ✅ Meals (with 4 sample meals)
- ✅ MealPlans (with 1 sample plan)
- ✅ MealPlanMeals (with 3 entries)

### 2. Test API
Open browser or Postman:
```
GET http://localhost:5000/
```

Should return:
```json
{
  "message": "Welcome to Healthy Meal Planner API",
  "version": "1.0.0"
}
```

### 3. Test Login (Using Sample Data)
```
POST http://localhost:5000/api/users/login

Body:
{
  "email": "john@example.com",
  "password": "user123"
}
```

**Note**: You need to register first, as the sample passwords in database.sql are placeholders.

---

## 📝 Default Admin Account

To create an admin account:

1. **Register normally first**:
```
POST http://localhost:5000/api/users/signup
Body: { "name": "Admin", "email": "admin@test.com", "password": "admin123" }
```

2. **Then update role in phpMyAdmin**:
   - Open `Users` table
   - Find your user
   - Change `role` from `user` to `admin`

---

## 🔧 Common XAMPP Issues

### MySQL won't start?
- **Port conflict**: Another MySQL instance running on port 3306
- **Solution**: Stop other MySQL services or change port in XAMPP config

### Can't connect to database?
- Make sure MySQL is running (green in XAMPP)
- Check `.env` has correct credentials
- Default XAMPP password is empty (no password)

### "Access denied for user 'root'@'localhost'"?
- Check if you set a MySQL password in XAMPP
- Update `DB_PASSWORD` in `.env` file

---

## 📸 For Your Report Screenshots

Take screenshots of:
1. **XAMPP Control Panel** - MySQL running
2. **phpMyAdmin** - Database structure showing all 4 tables
3. **phpMyAdmin** - Sample data in Users table
4. **Postman/Thunder Client** - Successful API calls
5. **Terminal** - Server running successfully

---

## 🎓 Perfect for CSCI426 Submission

✅ **Local Development**: XAMPP  
✅ **Database**: MySQL via phpMyAdmin  
✅ **Backend**: Node.js + Express  
✅ **Version Control**: Git (repository created)  
✅ **Documentation**: Complete  

Ready to submit! 🚀
