const { body, param } = require("express-validator");

const vehicleValidationRules = [
	body("year")
		.isInt({ min: 1900, max: 2100 })
		.withMessage("Year must be between 1900 and 2100")
		.toInt(),
	body("make")
		.trim()
		.notEmpty()
		.withMessage("Make is required")
		.isLength({ max: 50 })
		.withMessage("Make must be 50 characters or fewer"),
	body("model")
		.trim()
		.notEmpty()
		.withMessage("Model is required")
		.isLength({ max: 50 })
		.withMessage("Model must be 50 characters or fewer"),
	body("engine_trim")
		.optional({ checkFalsy: true })
		.trim()
		.isLength({ max: 50 })
		.withMessage("Engine/trim must be 50 characters or fewer"),
];

const vehicleIdParamRule = param("id")
	.isInt({ min: 1 })
	.withMessage("Invalid vehicle id")
	.toInt();

module.exports = { vehicleValidationRules, vehicleIdParamRule };
