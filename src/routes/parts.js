const express = require("express");
const {
	getParts,
	getLowStockParts,
	getPartById,
	createPart,
	updatePart,
	deletePart,
} = require("../controllers/partsController");
const {
	partValidationRules,
	partIdParamRule,
} = require("../validators/partValidators");
const { validateApi } = require("../validators/validate");

const router = express.Router();

// Specific routes must come before the /:id route so they aren't captured by it.
router.get("/low-stock", getLowStockParts);
router.get("/", getParts);
router.get("/:id", partIdParamRule, validateApi, getPartById);
router.post("/", partValidationRules, validateApi, createPart);
router.put(
	"/:id",
	partIdParamRule,
	partValidationRules,
	validateApi,
	updatePart,
);
router.delete("/:id", partIdParamRule, validateApi, deletePart);

module.exports = router;
