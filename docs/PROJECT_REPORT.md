# Healthy Meal Planner - Project Report

**Course:** CSCI426 - Advanced Web Programming  
**Project Phase:** 2 (Backend Development)  
**Student Name:** [Your Name]  
**Student ID:** [Your ID]  
**Date:** December 2024

---

## 1. Introduction

### 1.1 Project Overview
Healthy Meal Planner is a web application designed to help users create and manage weekly meal plans while tracking their nutritional intake. The application provides a RESTful API backend built with Node.js and MySQL, featuring user authentication, CRUD operations, and administrative capabilities.

### 1.2 Objectives
- Develop a fully functional backend API using Node.js
- Implement secure user authentication with JWT
- Design and integrate a relational MySQL database
- Create CRUD operations for meals and meal plans
- Implement bonus features (admin panel and email notifications)

---

## 2. Technologies Used

### 2.1 Backend Technologies
- **Node.js (v18+)**: JavaScript runtime for server-side development
- **Express.js (v4.18)**: Web application framework
- **MySQL2 (v3.6)**: MySQL database driver for Node.js

### 2.2 Authentication & Security
- **JWT (jsonwebtoken v9.0)**: Token-based authentication
- **bcryptjs (v2.4)**: Password hashing

### 2.3 Additional Tools
- **CORS (v2.8)**: Cross-Origin Resource Sharing
- **dotenv (v16.3)**: Environment variable management
- **Nodemailer (v6.9)**: Email notification system

---

## 3. System Architecture

### 3.1 Application Structure
The application follows the MVC (Model-View-Controller) pattern:
- **Controllers**: Handle business logic
- **Routes**: Define API endpoints
- **Middleware**: Authentication and error handling
- **Utils**: Helper functions (email service)

### 3.2 Database Design
The database consists of four main tables:
1. **Users**: Store user credentials and roles
2. **Meals**: Store meal information and nutrition data
3. **MealPlans**: Store weekly meal planning data
4. **MealPlanMeals**: Junction table linking meals to plans

**ER Diagram:**
```
Users (1) ----< (N) Meals
Users (1) ----< (N) MealPlans
MealPlans (1) ----< (N) MealPlanMeals >---- (N) Meals
```

---

## 4. Implementation Details

### 4.1 Database Connection
```javascript
// src/config/db.js
import mysql from 'mysql2';

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
```

### 4.2 User Authentication
**Signup Endpoint:**
```javascript
// Hash password and store user
const hashedPassword = await bcrypt.hash(password, 10);
db.query('INSERT INTO Users (name, email, password) VALUES (?, ?, ?)',
  [name, email, hashedPassword]);
```

**Login Endpoint:**
```javascript
// Verify password and generate JWT
const isMatch = await bcrypt.compare(password, user.password);
const token = jwt.sign({ id: user.id, email: user.email, role: user.role },
  process.env.JWT_SECRET, { expiresIn: '24h' });
```

### 4.3 Authentication Middleware
```javascript
// src/middleware/auth.js
export const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
};
```

### 4.4 CRUD Operations Example (Meals)
**Create:**
```javascript
db.query('INSERT INTO Meals (title, ingredients, calories, user_id) VALUES (?, ?, ?, ?)',
  [title, ingredients, calories, userId]);
```

**Read:**
```javascript
db.query('SELECT * FROM Meals WHERE user_id = ?', [userId]);
```

**Update:**
```javascript
db.query('UPDATE Meals SET title = ?, ingredients = ?, calories = ? WHERE id = ?',
  [title, ingredients, calories, mealId]);
```

**Delete:**
```javascript
db.query('DELETE FROM Meals WHERE id = ?', [mealId]);
```

### 4.5 Admin Panel Features
```javascript
// Get statistics
db.query('SELECT COUNT(*) as count FROM Users');
db.query('SELECT COUNT(*) as count FROM Meals');
db.query('SELECT COUNT(*) as count FROM MealPlans');
```

### 4.6 Email Notifications (Bonus)
```javascript
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD }
});

await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: userEmail,
  subject: 'Meal Plan Reminder',
  html: `<h2>Your weekly meal plan is ready!</h2>`
});
```

---

## 5. API Documentation

### 5.1 Authentication Endpoints
- **POST /api/users/signup**: Register new user
- **POST /api/users/login**: Authenticate and receive JWT token
- **GET /api/users/profile**: Get authenticated user profile

### 5.2 Meal Endpoints
- **POST /api/meals**: Create new meal
- **GET /api/meals**: Get all meals for user
- **GET /api/meals/:id**: Get specific meal
- **PUT /api/meals/:id**: Update meal
- **DELETE /api/meals/:id**: Delete meal

### 5.3 Meal Plan Endpoints
- **POST /api/mealplans**: Create weekly meal plan
- **GET /api/mealplans**: Get all plans for user
- **GET /api/mealplans/:id**: Get plan with meals
- **POST /api/mealplans/:id/meals**: Add meal to plan
- **DELETE /api/mealplans/:id**: Delete plan

### 5.4 Admin Endpoints
- **GET /api/admin/users**: Get all users (admin only)
- **GET /api/admin/statistics**: Get system statistics
- **DELETE /api/admin/users/:id**: Delete user (admin only)

---

## 6. Database Schema

### 6.1 Users Table
```sql
CREATE TABLE Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 6.2 Meals Table
```sql
CREATE TABLE Meals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  ingredients TEXT NOT NULL,
  calories INT NOT NULL,
  protein INT DEFAULT 0,
  carbs INT DEFAULT 0,
  fats INT DEFAULT 0,
  user_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);
```

---

## 7. Testing & Validation

### 7.1 Test Cases
1. **User Registration**: Successfully create new user account
2. **User Login**: Authenticate and receive valid JWT token
3. **Create Meal**: Add new meal with nutrition data
4. **Update Meal**: Modify existing meal information
5. **Delete Meal**: Remove meal from database
6. **Create Meal Plan**: Set up weekly meal planning
7. **Admin Access**: Verify admin-only endpoints are protected

### 7.2 Error Handling
- Input validation for all endpoints
- Database error handling
- Authentication error responses
- 404 for invalid routes

---

## 8. Screenshots

### 8.1 API Testing (Postman/Thunder Client)
[Insert screenshot: User signup request and response]

[Insert screenshot: Login request with JWT token response]

[Insert screenshot: Create meal with authorization header]

[Insert screenshot: Get all meals response]

### 8.2 Database
[Insert screenshot: MySQL database tables]

[Insert screenshot: Sample data in Users table]

[Insert screenshot: Sample data in Meals table]

---

## 9. Challenges & Solutions

### 9.1 Challenge 1: Password Security
**Problem**: Storing plain text passwords is insecure.  
**Solution**: Implemented bcryptjs for password hashing with salt rounds.

### 9.2 Challenge 2: API Authentication
**Problem**: Need to protect certain routes from unauthorized access.  
**Solution**: Implemented JWT-based authentication middleware.

### 9.3 Challenge 3: Database Relationships
**Problem**: Complex many-to-many relationship between meals and plans.  
**Solution**: Created junction table (MealPlanMeals) with proper foreign keys.

---

## 10. Conclusion

### 10.1 Summary
The Healthy Meal Planner project successfully demonstrates:
- Complete backend API development with Node.js and Express
- Secure user authentication using JWT
- Full CRUD operations on MySQL database
- Proper data validation and error handling
- Bonus features (admin panel and email notifications)

### 10.2 Learning Outcomes
- Gained practical experience with RESTful API design
- Understood authentication and authorization mechanisms
- Improved database design and relationship modeling skills
- Learned deployment and version control best practices

### 10.3 Future Scope
1. **Frontend Development**: Create React.js user interface
2. **Advanced Features**:
   - AI-powered meal recommendations
   - Barcode scanning for ingredients
   - Integration with nutrition APIs
   - Mobile app development
3. **Performance**:
   - Implement caching (Redis)
   - Database query optimization
   - Load balancing for scalability
4. **Social Features**:
   - Share meal plans with friends
   - Community recipes
   - Rating and review system

---

## 11. References

1. Express.js Documentation: https://expressjs.com/
2. MySQL Documentation: https://dev.mysql.com/doc/
3. JWT.io: https://jwt.io/
4. Node.js Best Practices: https://github.com/goldbergyoni/nodebestpractices
5. Nodemailer Documentation: https://nodemailer.com/

---

**Course:** CSCI426 - Advanced Web Programming  
**Instructor:** [Instructor Name]  
**Submission Date:** [Date]
