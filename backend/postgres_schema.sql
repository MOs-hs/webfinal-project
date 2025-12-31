-- PostgreSQL Schema for Healthy Meal Planner
-- Drop existing tables if they exist
DROP TABLE IF EXISTS MealPlanMeals CASCADE;
DROP TABLE IF EXISTS MealPlans CASCADE;
DROP TABLE IF EXISTS Meals CASCADE;
DROP TABLE IF EXISTS Users CASCADE;

-- Create Users table
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Meals table
CREATE TABLE Meals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    ingredients TEXT,
    calories INTEGER,
    protein DECIMAL(10,2),
    carbs DECIMAL(10,2),
    fats DECIMAL(10,2),
    meal_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create MealPlans table
CREATE TABLE MealPlans (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create MealPlanMeals table  
CREATE TABLE MealPlanMeals (
    id SERIAL PRIMARY KEY,
    meal_plan_id INTEGER NOT NULL REFERENCES MealPlans(id) ON DELETE CASCADE,
    meal_id INTEGER NOT NULL REFERENCES Meals(id) ON DELETE CASCADE,
    day_of_week VARCHAR(20),
    meal_time VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_meals_user_id ON Meals(user_id);
CREATE INDEX idx_meal_plans_user_id ON MealPlans(user_id);
CREATE INDEX idx_meal_plan_meals_plan_id ON MealPlanMeals(meal_plan_id);
CREATE INDEX idx_meal_plan_meals_meal_id ON MealPlanMeals(meal_id);
