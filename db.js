const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',            
  password: 'Lapeludita122',    
  database: 'postgres',         
  port: 5432
});

module.exports = pool;