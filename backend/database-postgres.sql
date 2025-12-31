-- Healthy Meal Planner - PostgreSQL Schema
-- This schema is compatible with Render's managed PostgreSQL

-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(10) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Meals Table
CREATE TABLE meals (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  ingredients TEXT NOT NULL,
  calories INTEGER NOT NULL,
  protein INTEGER DEFAULT 0,
  carbs INTEGER DEFAULT 0,
  fats INTEGER DEFAULT 0,
  user_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- MealPlans Table (Weekly Planning)
CREATE TABLE mealplans (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  total_calories INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- MealPlanMeals (Junction Table - Links Meals to Plans)
CREATE TABLE mealplanmeals (
  id SERIAL PRIMARY KEY,
  mealplan_id INTEGER,
  meal_id INTEGER,
  day_of_week VARCHAR(20),
  meal_type VARCHAR(20) DEFAULT 'lunch' CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  FOREIGN KEY (mealplan_id) REFERENCES mealplans(id) ON DELETE CASCADE,
  FOREIGN KEY (meal_id) REFERENCES meals(id) ON DELETE CASCADE
);

-- Insert Sample Data

-- Sample Admin User (password: admin123)
-- You need to generate a proper bcrypt hash or register through the app
INSERT INTO users (name, email, password, role) VALUES 
('Mo', 'mo@mealplanner.com', '$2a$10$YourHashedPasswordHere', 'admin');

-- Sample Regular User (password: user123)
INSERT INTO users (name, email, password, role) VALUES 
('Mo User', 'mo.user@example.com', '$2a$10$YourHashedPasswordHere', 'user');

-- Sample Meals
INSERT INTO meals (title, ingredients, calories, protein, carbs, fats, user_id) VALUES 
('Grilled Chicken Salad', 'Chicken breast, lettuce, tomatoes, olive oil', 350, 35, 15, 18, 2),
('Oatmeal with Berries', 'Oats, blueberries, honey, milk', 280, 8, 45, 6, 2),
('Salmon with Vegetables', 'Salmon fillet, broccoli, carrots, lemon', 420, 40, 20, 22, 2),
('Protein Smoothie', 'Banana, protein powder, almond milk, peanut butter', 320, 25, 35, 10, 2);

-- Sample Meal Plan
INSERT INTO mealplans (user_id, week_start, week_end, total_calories) VALUES 
(2, '2024-01-01', '2024-01-07', 2100);

-- Link Meals to Plan
INSERT INTO mealplanmeals (mealplan_id, meal_id, day_of_week, meal_type) VALUES 
(1, 2, 'Monday', 'breakfast'),
(1, 1, 'Monday', 'lunch'),
(1, 3, 'Monday', 'dinner');
