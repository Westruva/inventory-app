const { validationResult } = require("express-validator");

// For JSON API routes - responds with 400 + error list if validation failed.
function validateApi(req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	next();
}

module.exports = { validateApi };
