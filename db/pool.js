require("dotenv").config();
const { Pool } = require("pg");

// Single shared pool reused across the app instead of opening a new connection per query.
const pool = new Pool({
	host: process.env.PGHOST,
	port: process.env.PGPORT,
	user: process.env.PGUSER,
	password: process.env.PGPASSWORD,
	database: process.env.PGDATABASE,
});

module.exports = pool;
