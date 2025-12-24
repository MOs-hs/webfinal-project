-- Create Database
CREATE DATABASE IF NOT EXISTS healthy_meal_planner;
USE healthy_meal_planner;

-- Users Table
CREATE TABLE Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Meals Table
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

-- MealPlans Table (Weekly Planning)
CREATE TABLE MealPlans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  total_calories INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- MealPlanMeals (Junction Table - Links Meals to Plans)
CREATE TABLE MealPlanMeals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mealplan_id INT,
  meal_id INT,
  day_of_week VARCHAR(20),
  meal_type ENUM('breakfast', 'lunch', 'dinner', 'snack') DEFAULT 'lunch',
  FOREIGN KEY (mealplan_id) REFERENCES MealPlans(id) ON DELETE CASCADE,
  FOREIGN KEY (meal_id) REFERENCES Meals(id) ON DELETE CASCADE
);

-- Insert Sample Data

-- Sample Admin User (password: admin123)
INSERT INTO Users (name, email, password, role) VALUES 
('Admin User', 'admin@mealplanner.com', '$2a$10$YourHashedPasswordHere', 'admin');

-- Sample Regular User (password: user123)
INSERT INTO Users (name, email, password, role) VALUES 
('John Doe', 'john@example.com', '$2a$10$YourHashedPasswordHere', 'user');

-- Sample Meals
INSERT INTO Meals (title, ingredients, calories, protein, carbs, fats, user_id) VALUES 
('Grilled Chicken Salad', 'Chicken breast, lettuce, tomatoes, olive oil', 350, 35, 15, 18, 2),
('Oatmeal with Berries', 'Oats, blueberries, honey, milk', 280, 8, 45, 6, 2),
('Salmon with Vegetables', 'Salmon fillet, broccoli, carrots, lemon', 420, 40, 20, 22, 2),
('Protein Smoothie', 'Banana, protein powder, almond milk, peanut butter', 320, 25, 35, 10, 2);

-- Sample Meal Plan
INSERT INTO MealPlans (user_id, week_start, week_end, total_calories) VALUES 
(2, '2024-01-01', '2024-01-07', 2100);

-- Link Meals to Plan
INSERT INTO MealPlanMeals (mealplan_id, meal_id, day_of_week, meal_type) VALUES 
(1, 2, 'Monday', 'breakfast'),
(1, 1, 'Monday', 'lunch'),
(1, 3, 'Monday', 'dinner');
