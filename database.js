require("dotenv").config();
const Pool = require("pg").Pool;

const devConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
};

const productionConfig = {
  connectionString: process.env.DATABASE_URL, // will be coming from heroku addon ( cloud postgres )
  ssl: {
    rejectUnauthorized: false,
  },
};

const pool = new Pool(
  process.env.NODE_ENV.trim() === "production" ? productionConfig : devConfig
);

module.exports = pool;
