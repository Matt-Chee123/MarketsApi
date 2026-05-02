const { Pool } = require('pg');
require('dotenv').config();

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
    console.error('Unexpected database error on idle client:', err);
});

module.exports = { pool };