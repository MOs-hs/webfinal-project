import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const createTables = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  console.log('Connected to MySQL database');

  try {
    // Create Users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS Users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Users table created');

    // Create Meals table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS Meals (
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
      )
    `);
    console.log('✓ Meals table created');

    // Create MealPlans table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS MealPlans (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        week_start DATE NOT NULL,
        week_end DATE NOT NULL,
        total_calories INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ MealPlans table created');

    // Create MealPlanMeals table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS MealPlanMeals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        mealplan_id INT,
        meal_id INT,
        day_of_week VARCHAR(20),
        meal_type ENUM('breakfast', 'lunch', 'dinner', 'snack') DEFAULT 'lunch',
        FOREIGN KEY (mealplan_id) REFERENCES MealPlans(id) ON DELETE CASCADE,
        FOREIGN KEY (meal_id) REFERENCES Meals(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ MealPlanMeals table created');

    console.log('\n✅ All tables created successfully!');
  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    await connection.end();
  }
};

createTables();
