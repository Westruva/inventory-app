const pool = require("../../db/pool");

// GET /api/parts - supports optional ?category= filter
async function getParts(req, res, next) {
	try {
		const { category } = req.query;
		let result;

		if (category) {
			result = await pool.query(
				"SELECT * FROM parts WHERE category = $1 ORDER BY part_id",
				[category],
			);
		} else {
			result = await pool.query("SELECT * FROM parts ORDER BY part_id");
		}

		res.json(result.rows);
	} catch (err) {
		next(err);
	}
}

// GET /api/parts/low-stock - parts at or below their reorder level
async function getLowStockParts(req, res, next) {
	try {
		const result = await pool.query(
			"SELECT * FROM parts WHERE quantity_on_hand <= reorder_level ORDER BY part_id",
		);
		res.json(result.rows);
	} catch (err) {
		next(err);
	}
}

// GET /api/parts/:id
async function getPartById(req, res, next) {
	try {
		const { id } = req.params;
		const result = await pool.query("SELECT * FROM parts WHERE part_id = $1", [
			id,
		]);

		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Part not found" });
		}

		res.json(result.rows[0]);
	} catch (err) {
		next(err);
	}
}

// POST /api/parts
async function createPart(req, res, next) {
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

		if (
			!part_number ||
			!part_name ||
			cost === undefined ||
			retail_price === undefined
		) {
			return res
				.status(400)
				.json({
					error: "part_number, part_name, cost, and retail_price are required",
				});
		}

		const result = await pool.query(
			`INSERT INTO parts (part_number, brand, part_name, category, cost, retail_price, quantity_on_hand, reorder_level, location_bin)
       VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, 0), COALESCE($8, 5), $9)
       RETURNING *`,
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
			],
		);

		res.status(201).json(result.rows[0]);
	} catch (err) {
		// Postgres unique_violation code for a duplicate part_number.
		if (err.code === "23505") {
			return res
				.status(409)
				.json({ error: "A part with this part_number already exists" });
		}
		next(err);
	}
}

// PUT /api/parts/:id
async function updatePart(req, res, next) {
	try {
		const { id } = req.params;
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

		const result = await pool.query(
			`UPDATE parts
       SET part_number = COALESCE($1, part_number),
           brand = COALESCE($2, brand),
           part_name = COALESCE($3, part_name),
           category = COALESCE($4, category),
           cost = COALESCE($5, cost),
           retail_price = COALESCE($6, retail_price),
           quantity_on_hand = COALESCE($7, quantity_on_hand),
           reorder_level = COALESCE($8, reorder_level),
           location_bin = COALESCE($9, location_bin)
       WHERE part_id = $10
       RETURNING *`,
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

		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Part not found" });
		}

		res.json(result.rows[0]);
	} catch (err) {
		if (err.code === "23505") {
			return res
				.status(409)
				.json({ error: "A part with this part_number already exists" });
		}
		next(err);
	}
}

// DELETE /api/parts/:id
async function deletePart(req, res, next) {
	try {
		const { id } = req.params;
		const result = await pool.query(
			"DELETE FROM parts WHERE part_id = $1 RETURNING part_id",
			[id],
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Part not found" });
		}

		res.status(204).send();
	} catch (err) {
		next(err);
	}
}

module.exports = {
	getParts,
	getLowStockParts,
	getPartById,
	createPart,
	updatePart,
	deletePart,
};
