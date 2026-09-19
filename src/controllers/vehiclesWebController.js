const pool = require("../../db/pool");
const { validationResult } = require("express-validator");

// GET /vehicles
async function listVehicles(req, res, next) {
	try {
		const result = await pool.query(
			"SELECT * FROM vehicles ORDER BY vehicle_id",
		);
		res.render("vehicles/list", { vehicles: result.rows });
	} catch (err) {
		next(err);
	}
}

// GET /vehicles/new
function newVehicleForm(req, res) {
	res.render("vehicles/form", { vehicle: null });
}

// POST /vehicles
async function createVehicle(req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).render("vehicles/form", {
			vehicle: req.body,
			errors: errors.array(),
		});
	}

	try {
		const { year, make, model, engine_trim } = req.body;
		await pool.query(
			"INSERT INTO vehicles (year, make, model, engine_trim) VALUES ($1, $2, $3, $4)",
			[year, make, model, engine_trim],
		);
		res.redirect("/vehicles");
	} catch (err) {
		next(err);
	}
}

// GET /vehicles/:id - show detail + fitted parts
async function showVehicle(req, res, next) {
	try {
		const { id } = req.params;
		const vehicleResult = await pool.query(
			"SELECT * FROM vehicles WHERE vehicle_id = $1",
			[id],
		);

		if (vehicleResult.rows.length === 0) {
			return res.status(404).render("not-found", { item: "Vehicle" });
		}

		const fittedParts = await pool.query(
			`SELECT p.*, f.fitment_id
       FROM parts p
       JOIN part_fitment f ON f.part_id = p.part_id
       WHERE f.vehicle_id = $1
       ORDER BY p.part_id`,
			[id],
		);

		const allParts = await pool.query("SELECT * FROM parts ORDER BY part_name");

		res.render("vehicles/show", {
			vehicle: vehicleResult.rows[0],
			fittedParts: fittedParts.rows,
			allParts: allParts.rows,
		});
	} catch (err) {
		next(err);
	}
}

// GET /vehicles/:id/edit
async function editVehicleForm(req, res, next) {
	try {
		const { id } = req.params;
		const result = await pool.query(
			"SELECT * FROM vehicles WHERE vehicle_id = $1",
			[id],
		);

		if (result.rows.length === 0) {
			return res.status(404).render("not-found", { item: "Vehicle" });
		}

		res.render("vehicles/form", { vehicle: result.rows[0] });
	} catch (err) {
		next(err);
	}
}

// POST /vehicles/:id/update
async function updateVehicle(req, res, next) {
	const { id } = req.params;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).render("vehicles/form", {
			vehicle: { ...req.body, vehicle_id: id },
			errors: errors.array(),
		});
	}

	try {
		const { year, make, model, engine_trim } = req.body;

		await pool.query(
			"UPDATE vehicles SET year = $1, make = $2, model = $3, engine_trim = $4 WHERE vehicle_id = $5",
			[year, make, model, engine_trim, id],
		);

		res.redirect(`/vehicles/${id}`);
	} catch (err) {
		next(err);
	}
}

// POST /vehicles/:id/delete
async function deleteVehicle(req, res, next) {
	try {
		const { id } = req.params;
		await pool.query("DELETE FROM vehicles WHERE vehicle_id = $1", [id]);
		res.redirect("/vehicles");
	} catch (err) {
		next(err);
	}
}

module.exports = {
	listVehicles,
	newVehicleForm,
	createVehicle,
	showVehicle,
	editVehicleForm,
	updateVehicle,
	deleteVehicle,
};
