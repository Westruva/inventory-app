const pool = require("../../db/pool");
const { validationResult } = require("express-validator");

// POST /fitment - link a part to a vehicle, called from either show page
async function createFitment(req, res, next) {
	// The dropdowns only offer real ids, so a validation failure here means a
	// tampered request - a full-page error is fine rather than re-rendering the form.
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		const { part_id, vehicle_id, redirect_to } = req.body;

		await pool.query(
			`INSERT INTO part_fitment (part_id, vehicle_id)
       VALUES ($1, $2)
       ON CONFLICT ON CONSTRAINT unique_fitment DO NOTHING`,
			[part_id, vehicle_id],
		);

		res.redirect(redirect_to || "/");
	} catch (err) {
		next(err);
	}
}

// POST /fitment/:id/delete
async function deleteFitment(req, res, next) {
	try {
		const { id } = req.params;
		const { redirect_to } = req.body;

		await pool.query("DELETE FROM part_fitment WHERE fitment_id = $1", [id]);

		res.redirect(redirect_to || "/");
	} catch (err) {
		next(err);
	}
}

module.exports = { createFitment, deleteFitment };
