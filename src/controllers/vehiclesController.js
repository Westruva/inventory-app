const pool = require("../../db/pool");

// GET /api/vehicles
async function getVehicles(req, res, next) {
	try {
		const result = await pool.query(
			"SELECT * FROM vehicles ORDER BY vehicle_id",
		);
		res.json(result.rows);
	} catch (err) {
		next(err);
	}
}

// GET /api/vehicles/:id
async function getVehicleById(req, res, next) {
	try {
		const { id } = req.params;
		const result = await pool.query(
			"SELECT * FROM vehicles WHERE vehicle_id = $1",
			[id],
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Vehicle not found" });
		}

		res.json(result.rows[0]);
	} catch (err) {
		next(err);
	}
}

// POST /api/vehicles
async function createVehicle(req, res, next) {
	try {
		const { year, make, model, engine_trim } = req.body;

		if (!year || !make || !model) {
			return res
				.status(400)
				.json({ error: "year, make, and model are required" });
		}

		const result = await pool.query(
			`INSERT INTO vehicles (year, make, model, engine_trim)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
			[year, make, model, engine_trim],
		);

		res.status(201).json(result.rows[0]);
	} catch (err) {
		next(err);
	}
}

// PUT /api/vehicles/:id
async function updateVehicle(req, res, next) {
	try {
		const { id } = req.params;
		const { year, make, model, engine_trim } = req.body;

		const result = await pool.query(
			`UPDATE vehicles
       SET year = COALESCE($1, year),
           make = COALESCE($2, make),
           model = COALESCE($3, model),
           engine_trim = COALESCE($4, engine_trim)
       WHERE vehicle_id = $5
       RETURNING *`,
			[year, make, model, engine_trim, id],
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Vehicle not found" });
		}

		res.json(result.rows[0]);
	} catch (err) {
		next(err);
	}
}

// DELETE /api/vehicles/:id
async function deleteVehicle(req, res, next) {
	try {
		const { id } = req.params;
		const result = await pool.query(
			"DELETE FROM vehicles WHERE vehicle_id = $1 RETURNING vehicle_id",
			[id],
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Vehicle not found" });
		}

		res.status(204).send();
	} catch (err) {
		next(err);
	}
}

// GET /api/vehicles/:id/parts - all parts that fit this vehicle
async function getPartsForVehicle(req, res, next) {
	try {
		const { id } = req.params;
		const result = await pool.query(
			`SELECT p.*
       FROM parts p
       JOIN part_fitment f ON f.part_id = p.part_id
       WHERE f.vehicle_id = $1
       ORDER BY p.part_id`,
			[id],
		);
		res.json(result.rows);
	} catch (err) {
		next(err);
	}
}

module.exports = {
	getVehicles,
	getVehicleById,
	createVehicle,
	updateVehicle,
	deleteVehicle,
	getPartsForVehicle,
};
