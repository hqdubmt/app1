const path = require('path');
// Trỏ thẳng về thư mục nhà của user (home directory) rồi vào app1/.env
require('dotenv').config({ path: path.resolve(process.env.HOME, 'app1/.env') }); 

const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.DB_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.DB_PORT || 5432),
});

module.exports = pool;
