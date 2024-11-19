const { Pool } = require('pg'); // Import the Pool constructor from 'pg'

const pool = new Pool({
  host: 'aws-0-ap-south-1.pooler.supabase.com',
  port: 6543,
  user: 'postgres.gfzvbdnjmnonmoghkxva', 
  password: 'Singh@123#45',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }, // SSL setting for secure connection (if needed by Supabase)
});

module.exports=pool