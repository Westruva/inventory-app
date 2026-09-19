const pool = require("../../db/pool");

// POST /api/fitment - link a part to a vehicle it fits
async function createFitment(req, res, next) {
	try {
		const { part_id, vehicle_id } = req.body;

		if (!part_id || !vehicle_id) {
			return res
				.status(400)
				.json({ error: "part_id and vehicle_id are required" });
		}

		const result = await pool.query(
			`INSERT INTO part_fitment (part_id, vehicle_id)
       VALUES ($1, $2)
       RETURNING *`,
			[part_id, vehicle_id],
		);

		res.status(201).json(result.rows[0]);
	} catch (err) {
		// Postgres unique_violation code - this fitment already exists.
		if (err.code === "23505") {
			return res
				.status(409)
				.json({ error: "This part is already linked to this vehicle" });
		}
		// Postgres foreign_key_violation code - part_id or vehicle_id doesn't exist.
		if (err.code === "23503") {
			return res
				.status(400)
				.json({ error: "part_id or vehicle_id does not exist" });
		}
		next(err);
	}
}

// DELETE /api/fitment/:id
async function deleteFitment(req, res, next) {
	try {
		const { id } = req.params;
		const result = await pool.query(
			"DELETE FROM part_fitment WHERE fitment_id = $1 RETURNING fitment_id",
			[id],
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Fitment not found" });
		}

		res.status(204).send();
	} catch (err) {
		next(err);
	}
}

module.exports = { createFitment, deleteFitment };
