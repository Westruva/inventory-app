require("dotenv").config();
const { Pool } = require("pg");

// Railway (and most hosts) provide a single DATABASE_URL instead of separate
// PGHOST/PGUSER/etc, and require SSL for external connections.
const pool = process.env.DATABASE_URL
	? new Pool({
			connectionString: process.env.DATABASE_URL,
			ssl:
				process.env.PGSSL === "false" ? false : { rejectUnauthorized: false },
		})
	: new Pool({
			host: process.env.PGHOST,
			port: process.env.PGPORT,
			user: process.env.PGUSER,
			password: process.env.PGPASSWORD,
			database: process.env.PGDATABASE,
		});

module.exports = pool;
