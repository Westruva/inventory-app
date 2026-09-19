const pool = require("../../db/pool");
const { validationResult } = require("express-validator");

// GET / - dashboard with quick stats
async function getDashboard(req, res, next) {
	try {
		const partsCount = await pool.query("SELECT COUNT(*) FROM parts");
		const vehiclesCount = await pool.query("SELECT COUNT(*) FROM vehicles");
		const lowStock = await pool.query(
			"SELECT * FROM parts WHERE quantity_on_hand <= reorder_level ORDER BY part_id",
		);

		res.render("index", {
			partsCount: partsCount.rows[0].count,
			vehiclesCount: vehiclesCount.rows[0].count,
			lowStock: lowStock.rows,
		});
	} catch (err) {
		next(err);
	}
}

// GET /parts - list, with optional ?category= and ?q= search
async function listParts(req, res, next) {
	try {
		const { category, q } = req.query;
		const conditions = [];
		const values = [];

		if (category) {
			values.push(category);
			conditions.push(`category = $${values.length}`);
		}
		if (q) {
			values.push(`%${q}%`);
			conditions.push(
				`(part_name ILIKE $${values.length} OR part_number ILIKE $${values.length})`,
			);
		}

		const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
		const result = await pool.query(
			`SELECT * FROM parts ${where} ORDER BY part_id`,
			values,
		);

		res.render("parts/list", {
			parts: result.rows,
			category: category || "",
			q: q || "",
		});
	} catch (err) {
		next(err);
	}
}

// GET /parts/new
function newPartForm(req, res) {
	res.render("parts/form", { part: null });
}

// POST /parts
async function createPart(req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).render("parts/form", {
			part: req.body,
			errors: errors.array(),
		});
	}

	try {
		const {
			part_number,
			brand,
			part_name,
			category,
			cost,
			retail_price,
			quantity_on_hand,
			reorder_level,
			location_bin,
		} = req.body;

		await pool.query(
			`INSERT INTO parts (part_number, brand, part_name, category, cost, retail_price, quantity_on_hand, reorder_level, location_bin)
       VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, 0), COALESCE($8, 5), $9)`,
			[
				part_number,
				brand,
				part_name,
				category,
				cost,
				retail_price,
				quantity_on_hand || null,
				reorder_level || null,
				location_bin,
			],
		);

		res.redirect("/parts");
	} catch (err) {
		next(err);
	}
}

// GET /parts/:id - show detail + fitted vehicles
async function showPart(req, res, next) {
	try {
		const { id } = req.params;
		const partResult = await pool.query(
			"SELECT * FROM parts WHERE part_id = $1",
			[id],
		);

		if (partResult.rows.length === 0) {
			return res.status(404).render("not-found", { item: "Part" });
		}

		const fittedVehicles = await pool.query(
			`SELECT v.*, f.fitment_id
       FROM vehicles v
       JOIN part_fitment f ON f.vehicle_id = v.vehicle_id
       WHERE f.part_id = $1
       ORDER BY v.vehicle_id`,
			[id],
		);

		const allVehicles = await pool.query(
			"SELECT * FROM vehicles ORDER BY make, model",
		);

		res.render("parts/show", {
			part: partResult.rows[0],
			fittedVehicles: fittedVehicles.rows,
			allVehicles: allVehicles.rows,
		});
	} catch (err) {
		next(err);
	}
}

// GET /parts/:id/edit
async function editPartForm(req, res, next) {
	try {
		const { id } = req.params;
		const result = await pool.query("SELECT * FROM parts WHERE part_id = $1", [
			id,
		]);

		if (result.rows.length === 0) {
			return res.status(404).render("not-found", { item: "Part" });
		}

		res.render("parts/form", { part: result.rows[0] });
	} catch (err) {
		next(err);
	}
}

// POST /parts/:id/update
async function updatePart(req, res, next) {
	const { id } = req.params;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).render("parts/form", {
			part: { ...req.body, part_id: id },
			errors: errors.array(),
		});
	}

	try {
		const {
			part_number,
			brand,
			part_name,
			category,
			cost,
			retail_price,
			quantity_on_hand,
			reorder_level,
			location_bin,
		} = req.body;

		await pool.query(
			`UPDATE parts
       SET part_number = $1, brand = $2, part_name = $3, category = $4,
           cost = $5, retail_price = $6, quantity_on_hand = $7, reorder_level = $8, location_bin = $9
       WHERE part_id = $10`,
			[
				part_number,
				brand,
				part_name,
				category,
				cost,
				retail_price,
				quantity_on_hand,
				reorder_level,
				location_bin,
				id,
			],
		);

		res.redirect(`/parts/${id}`);
	} catch (err) {
		next(err);
	}
}

// POST /parts/:id/delete
async function deletePart(req, res, next) {
	try {
		const { id } = req.params;
		await pool.query("DELETE FROM parts WHERE part_id = $1", [id]);
		res.redirect("/parts");
	} catch (err) {
		next(err);
	}
}

module.exports = {
	getDashboard,
	listParts,
	newPartForm,
	createPart,
	showPart,
	editPartForm,
	updatePart,
	deletePart,
};
