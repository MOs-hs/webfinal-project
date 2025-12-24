# Healthy Meal Planner 🍽️

**A Node.js web application for creating weekly meal plans and tracking nutrition**

**Course:** CSCI426 - Advanced Web Programming  
**Project Phase:** 2 (Backend Development)

---

## 📋 Project Description

Healthy Meal Planner is a full-stack web application that helps users create and manage healthy meal plans, track nutrition, and achieve their health goals. The application features user authentication, CRUD operations for meals and meal plans, and an admin panel for managing users and viewing statistics.

---

## ✨ Features

### Core Features (Required)
- ✅ **User Authentication**: Secure signup and login with JWT tokens
- ✅ **CRUD Operations**: Complete Create, Read, Update, Delete functionality
- ✅ **Database Integration**: MySQL with related entities (Users, Meals, MealPlans)
- ✅ **Data Validation**: Input validation and error handling
- ✅ **Node.js Backend**: RESTful API built with Express.js

### Bonus Features
- ⭐ **Admin Panel**: User management and statistics dashboard
- ⭐ **Email Notifications**: Meal plan reminders using Nodemailer

---

## 🛠️ Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Authentication:** JWT (JSON Web Tokens), bcryptjs
- **Email:** Nodemailer
- **Other:** CORS, dotenv

---

## 📂 Project Structure

```
healthy-meal-planner/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # MySQL connection
│   │   ├── models/
│   │   ├── controllers/
│   │   │   ├── userController.js  # Authentication logic
│   │   │   ├── mealController.js  # Meal CRUD
│   │   │   ├── mealPlanController.js
│   │   │   └── adminController.js
│   │   ├── routes/
│   │   │   ├── userRoutes.js
│   │   │   ├── mealRoutes.js
│   │   │   ├── mealPlanRoutes.js
│   │   │   └── adminRoutes.js
│   │   ├── middleware/
│   │   │   └── auth.js            # JWT middleware
│   │   ├── utils/
│   │   │   └── sendEmail.js       # Email utility
│   │   ├── app.js                 # Express setup
│   │   └── server.js              # Entry point
│   ├── database.sql               # Database schema
│   ├── package.json
│   └── .env.example
└── docs/
    └── report.pdf
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Step 1: Clone the Repository
```bash
git clone <your-github-repo-url>
cd healthy-meal-planner/backend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Set Up Database
1. Open MySQL and create the database:
```sql
CREATE DATABASE healthy_meal_planner;
```

2. Import the schema:
```bash
mysql -u root -p healthy_meal_planner < database.sql
```

### Step 4: Configure Environment Variables
1. Copy `.env.example` to `.env`:
```bash
copy .env.example .env
```

2. Edit `.env` and add your database credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=healthy_meal_planner

PORT=5000
JWT_SECRET=your_secret_key_here

# Optional (for email feature)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### Step 5: Run the Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/users/signup` | Register new user | No |
| POST | `/api/users/login` | Login user | No |
| GET | `/api/users/profile` | Get user profile | Yes |

### Meals
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/meals` | Create meal | Yes |
| GET | `/api/meals` | Get all meals | Yes |
| GET | `/api/meals/:id` | Get meal by ID | Yes |
| PUT | `/api/meals/:id` | Update meal | Yes |
| DELETE | `/api/meals/:id` | Delete meal | Yes |

### Meal Plans
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/mealplans` | Create meal plan | Yes |
| GET | `/api/mealplans` | Get all plans | Yes |
| GET | `/api/mealplans/:id` | Get plan details | Yes |
| POST | `/api/mealplans/:id/meals` | Add meal to plan | Yes |
| DELETE | `/api/mealplans/:id` | Delete plan | Yes |

### Admin (Admin Role Only)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/users` | Get all users | Yes (Admin) |
| GET | `/api/admin/statistics` | Get stats | Yes (Admin) |
| DELETE | `/api/admin/users/:id` | Delete user | Yes (Admin) |

---

## 🗄️ Database Schema

### Users Table
- `id` (Primary Key)
- `name`
- `email` (Unique)
- `password` (Hashed)
- `role` (user/admin)
- `created_at`

### Meals Table
- `id` (Primary Key)
- `title`
- `ingredients`
- `calories`, `protein`, `carbs`, `fats`
- `user_id` (Foreign Key → Users)
- `created_at`

### MealPlans Table
- `id` (Primary Key)
- `user_id` (Foreign Key → Users)
- `week_start`, `week_end`
- `total_calories`
- `created_at`

### MealPlanMeals (Junction Table)
- `id` (Primary Key)
- `mealplan_id` (Foreign Key → MealPlans)
- `meal_id` (Foreign Key → Meals)
- `day_of_week`
- `meal_type`

---

## 🧪 Testing the API

You can test the API using **Postman** or **Thunder Client**:

### 1. Register a User
```
POST http://localhost:5000/api/users/signup
Body (JSON):
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### 2. Login
```
POST http://localhost:5000/api/users/login
Body (JSON):
{
  "email": "john@example.com",
  "password": "password123"
}
```
Copy the `token` from the response.

### 3. Create a Meal (Protected Route)
```
POST http://localhost:5000/api/meals
Headers:
  Authorization: Bearer YOUR_TOKEN_HERE
Body (JSON):
{
  "title": "Grilled Chicken Salad",
  "ingredients": "Chicken, lettuce, tomatoes",
  "calories": 350,
  "protein": 35,
  "carbs": 15,
  "fats": 18
}
```

---

## 📸 Screenshots

*(Add screenshots of your API testing, database, and any frontend if applicable)*

---

## 🎯 Future Enhancements

- Mobile application (React Native)
- Barcode scanning for ingredients
- AI-powered meal suggestions
- Social features (share meal plans)
- Integration with fitness trackers

---

## 👨‍💻 Author

**Your Name**  
Student ID: XXXXXXXX  
CSCI426 - Advanced Web Programming

---

## 📄 License

This project is created for educational purposes as part of CSCI426 course requirements.

---

## 🙏 Acknowledgments

- Department of Computer Science and Information Technology
- CSCI426 Course Instructor
- Node.js and Express.js documentation
