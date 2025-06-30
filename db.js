const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'BlogDB',
  password: 'new_password',
  port: 5433,
});

module.exports = pool;