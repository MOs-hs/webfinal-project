# API Testing Guide

Use **Postman** or **Thunder Client** (VS Code extension) to test the API.

## Base URL
```
http://localhost:5000
```

---

## 1. Authentication Tests

### Register New User
```
POST http://localhost:5000/api/users/signup

Body (JSON):
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Expected Response (201):
{
  "message": "User registered successfully",
  "userId": 3
}
```

### Login User
```
POST http://localhost:5000/api/users/login

Body (JSON):
{
  "email": "john@example.com",
  "password": "password123"
}

Expected Response (200):
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 3,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**⚠️ IMPORTANT: Copy the token from the response for the next requests!**

### Get User Profile
```
GET http://localhost:5000/api/users/profile

Headers:
  Authorization: Bearer YOUR_TOKEN_HERE

Expected Response (200):
{
  "id": 3,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "created_at": "2024-12-24T..."
}
```

---

## 2. Meal CRUD Tests

### Create Meal
```
POST http://localhost:5000/api/meals

Headers:
  Authorization: Bearer YOUR_TOKEN_HERE

Body (JSON):
{
  "title": "Grilled Chicken Salad",
  "ingredients": "Chicken breast, lettuce, tomatoes, olive oil, lemon",
  "calories": 350,
  "protein": 35,
  "carbs": 15,
  "fats": 18
}

Expected Response (201):
{
  "message": "Meal created successfully",
  "mealId": 5
}
```

### Get All Meals
```
GET http://localhost:5000/api/meals

Headers:
  Authorization: Bearer YOUR_TOKEN_HERE

Expected Response (200):
[
  {
    "id": 5,
    "title": "Grilled Chicken Salad",
    "ingredients": "Chicken breast, lettuce, tomatoes, olive oil, lemon",
    "calories": 350,
    "protein": 35,
    "carbs": 15,
    "fats": 18,
    "user_id": 3,
    "created_at": "2024-12-24T..."
  }
]
```

### Get Meal by ID
```
GET http://localhost:5000/api/meals/5

Headers:
  Authorization: Bearer YOUR_TOKEN_HERE

Expected Response (200):
{
  "id": 5,
  "title": "Grilled Chicken Salad",
  ...
}
```

### Update Meal
```
PUT http://localhost:5000/api/meals/5

Headers:
  Authorization: Bearer YOUR_TOKEN_HERE

Body (JSON):
{
  "title": "Healthy Chicken Salad",
  "ingredients": "Grilled chicken, mixed greens, cherry tomatoes",
  "calories": 320,
  "protein": 38,
  "carbs": 12,
  "fats": 15
}

Expected Response (200):
{
  "message": "Meal updated successfully"
}
```

### Delete Meal
```
DELETE http://localhost:5000/api/meals/5

Headers:
  Authorization: Bearer YOUR_TOKEN_HERE

Expected Response (200):
{
  "message": "Meal deleted successfully"
}
```

---

## 3. Meal Plan Tests

### Create Meal Plan
```
POST http://localhost:5000/api/mealplans

Headers:
  Authorization: Bearer YOUR_TOKEN_HERE

Body (JSON):
{
  "week_start": "2024-12-23",
  "week_end": "2024-12-29"
}

Expected Response (201):
{
  "message": "Meal plan created successfully",
  "planId": 2
}
```

### Get All Meal Plans
```
GET http://localhost:5000/api/mealplans

Headers:
  Authorization: Bearer YOUR_TOKEN_HERE

Expected Response (200):
[
  {
    "id": 2,
    "user_id": 3,
    "week_start": "2024-12-23",
    "week_end": "2024-12-29",
    "total_calories": 0,
    "created_at": "2024-12-24T..."
  }
]
```

### Add Meal to Plan
```
POST http://localhost:5000/api/mealplans/2/meals

Headers:
  Authorization: Bearer YOUR_TOKEN_HERE

Body (JSON):
{
  "meal_id": 1,
  "day_of_week": "Monday",
  "meal_type": "lunch"
}

Expected Response (200):
{
  "message": "Meal added to plan successfully"
}
```

### Get Meal Plan Details
```
GET http://localhost:5000/api/mealplans/2

Headers:
  Authorization: Bearer YOUR_TOKEN_HERE

Expected Response (200):
[
  {
    "id": 2,
    "week_start": "2024-12-23",
    "week_end": "2024-12-29",
    "meal_id": 1,
    "title": "Grilled Chicken Salad",
    "calories": 350,
    "day_of_week": "Monday",
    "meal_type": "lunch"
  }
]
```

---

## 4. Admin Tests (Admin Token Required)

### Get All Users
```
GET http://localhost:5000/api/admin/users

Headers:
  Authorization: Bearer ADMIN_TOKEN_HERE

Expected Response (200):
[
  {
    "id": 1,
    "name": "Admin User",
    "email": "admin@mealplanner.com",
    "role": "admin",
    "created_at": "..."
  },
  ...
]
```

### Get Statistics
```
GET http://localhost:5000/api/admin/statistics

Headers:
  Authorization: Bearer ADMIN_TOKEN_HERE

Expected Response (200):
{
  "totalUsers": 5,
  "totalMeals": 12,
  "totalPlans": 3
}
```

### Delete User
```
DELETE http://localhost:5000/api/admin/users/3

Headers:
  Authorization: Bearer ADMIN_TOKEN_HERE

Expected Response (200):
{
  "message": "User deleted successfully"
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Access denied. No token provided."
}
```

### 403 Forbidden
```json
{
  "error": "Invalid token"
}
// or
{
  "error": "Access denied. Admin only."
}
```

### 404 Not Found
```json
{
  "error": "Meal not found"
}
```

### 400 Bad Request
```json
{
  "error": "All fields are required"
}
```
