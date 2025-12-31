import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to PostgreSQL database');
});

// Helper function to execute queries (mimics MySQL callback style)
const db = {
  query: (sql, params, callback) => {
    return pool.query(sql, params, callback);
  },
  end: () => pool.end()
};

export default db;
