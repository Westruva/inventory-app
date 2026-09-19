const { body, param } = require("express-validator");

// Trim + bound string length, sanitizing is limited to trimming - HTML escaping
// is left to the view layer (EJS `<%= %>` already escapes on output), so we don't
// corrupt stored data (e.g. an apostrophe in a name) by escaping it twice.
const partValidationRules = [
	body("part_number")
		.trim()
		.notEmpty()
		.withMessage("Part number is required")
		.isLength({ max: 50 })
		.withMessage("Part number must be 50 characters or fewer"),
	body("brand")
		.optional({ checkFalsy: true })
		.trim()
		.isLength({ max: 50 })
		.withMessage("Brand must be 50 characters or fewer"),
	body("part_name")
		.trim()
		.notEmpty()
		.withMessage("Part name is required")
		.isLength({ max: 100 })
		.withMessage("Part name must be 100 characters or fewer"),
	body("category")
		.optional({ checkFalsy: true })
		.trim()
		.isLength({ max: 50 })
		.withMessage("Category must be 50 characters or fewer"),
	body("cost")
		.isFloat({ min: 0 })
		.withMessage("Cost must be a number of 0 or more")
		.toFloat(),
	body("retail_price")
		.isFloat({ min: 0 })
		.withMessage("Retail price must be a number of 0 or more")
		.toFloat(),
	body("quantity_on_hand")
		.optional({ checkFalsy: true })
		.isInt({ min: 0 })
		.withMessage("Quantity on hand must be a whole number of 0 or more")
		.toInt(),
	body("reorder_level")
		.optional({ checkFalsy: true })
		.isInt({ min: 0 })
		.withMessage("Reorder level must be a whole number of 0 or more")
		.toInt(),
	body("location_bin")
		.optional({ checkFalsy: true })
		.trim()
		.isLength({ max: 20 })
		.withMessage("Location bin must be 20 characters or fewer"),
];

const partIdParamRule = param("id")
	.isInt({ min: 1 })
	.withMessage("Invalid part id")
	.toInt();

module.exports = { partValidationRules, partIdParamRule };
