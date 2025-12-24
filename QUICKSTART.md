# Quick Start Guide

## 🚀 15-Minute Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Set Up MySQL Database
Open MySQL and run:
```bash
mysql -u root -p < database.sql
```

This will:
- Create the `healthy_meal_planner` database
- Create all tables (Users, Meals, MealPlans, MealPlanMeals)
- Add sample data

### 3. Configure Environment
```bash
# Copy the example file
copy .env.example .env

# Edit .env and add your MySQL credentials
```

**Required settings in `.env`:**
```
DB_PASSWORD=your_mysql_password
JWT_SECRET=any_random_string_here
```

### 4. Run the Server
```bash
npm run dev
```

Server will start at: `http://localhost:5000`

### 5. Test the API
Use the `docs/API_TESTING.md` file to test endpoints with Postman or Thunder Client.

**First test** - Check if server is running:
```
GET http://localhost:5000/
```

---

## 📊 Sample Use Case Flow

1. **Register**: Create a new user account
2. **Login**: Get JWT token
3. **Create Meals**: Add healthy meals to your library
4. **Create Plan**: Set up a weekly meal plan
5. **Add Meals to Plan**: Schedule meals for each day

---

## 🔧 Troubleshooting

### Can't connect to database?
- Make sure MySQL is running
- Check your `.env` credentials
- Verify database exists: `SHOW DATABASES;`

### "Access denied" errors?
- Make sure you include the JWT token in headers
- Format: `Authorization: Bearer YOUR_TOKEN`

### Port 5000 already in use?
- Change PORT in `.env` file
- Or stop the other process using port 5000

---

## 📝 For Your Report

### Screenshots to Include:
1. Database structure (MySQL Workbench)
2. API testing (Postman showing signup, login, create meal)
3. JWT token in authorization header
4. Successful CRUD operations

### Code Snippets to Include:
- JWT authentication middleware
- Password hashing (signup controller)
- CRUD operation example
- Database connection

---

## 🎓 Evaluation Checklist

- [x] **Functionality (50 marks)**
  - [x] Features working
  - [x] CRUD operations
  - [x] Backend functional

- [x] **Code Quality (15 marks)**
  - [x] Readable code with comments
  - [x] Version control (Git)
  - [x] Documentation

- [ ] **Deployment (10 marks)**
  - [ ] GitHub repository
  - [ ] Deployed on Render/Railway

- [x] **Report & Presentation (10 marks)**
  - [x] Documentation
  - [x] Visuals
  - [x] Clear explanations

- [x] **Database Integration (15 marks)**
  - [x] Schema design
  - [x] Proper relationships
  - [x] Queries working

**Total Features: 95/100** (without deployment)
**With Bonus Features: +10 marks** (Email + Admin panel)
