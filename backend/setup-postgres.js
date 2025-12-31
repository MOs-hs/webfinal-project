import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function setupDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('Connected to PostgreSQL database');
    
    // Drop existing tables
    await client.query('DROP TABLE IF EXISTS MealPlanMeals CASCADE');
    await client.query('DROP TABLE IF EXISTS MealPlans CASCADE');
    await client.query('DROP TABLE IF EXISTS Meals CASCADE');
    await client.query('DROP TABLE IF EXISTS Users CASCADE');
    
    // Create Users table
    await client.query(`
      CREATE TABLE Users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Users table created');
    
    // Create Meals table
    await client.query(`
      CREATE TABLE Meals (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        calories INTEGER,
        protein DECIMAL(10,2),
        carbs DECIMAL(10,2),
        fats DECIMAL(10,2),
        meal_type VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Meals table created');
    
    // Create MealPlans table
    await client.query(`
      CREATE TABLE MealPlans (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        start_date DATE,
        end_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ MealPlans table created');
    
    // Create MealPlanMeals table
    await client.query(`
      CREATE TABLE MealPlanMeals (
        id SERIAL PRIMARY KEY,
        meal_plan_id INTEGER NOT NULL REFERENCES MealPlans(id) ON DELETE CASCADE,
        meal_id INTEGER NOT NULL REFERENCES Meals(id) ON DELETE CASCADE,
        day_of_week VARCHAR(20),
        meal_time VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ MealPlanMeals table created');
    
    console.log('\n✅ All tables created successfully!');
    
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

setupDatabase()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
