const { body, param } = require("express-validator");

const fitmentValidationRules = [
	body("part_id")
		.isInt({ min: 1 })
		.withMessage("part_id must be a positive integer")
		.toInt(),
	body("vehicle_id")
		.isInt({ min: 1 })
		.withMessage("vehicle_id must be a positive integer")
		.toInt(),
];

const fitmentIdParamRule = param("id")
	.isInt({ min: 1 })
	.withMessage("Invalid fitment id")
	.toInt();

module.exports = { fitmentValidationRules, fitmentIdParamRule };
