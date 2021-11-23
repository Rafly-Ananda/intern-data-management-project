require("dotenv").config();
const Pool = require("pg").Pool;

const pool = new Pool({
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  pool: {
    max: 5, // maximum number of connection in the pool
    min: 0, // minimum number of connection in the pool
    acquire: 30000, //maximum time, in milliseconds, that pool will try to get connection before throwing error
    idle: 10000, // maximum time, in milliseconds, that a connection can be idle before being released
  },
});

module.exports = pool;
