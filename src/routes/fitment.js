const express = require("express");
const {
	createFitment,
	deleteFitment,
} = require("../controllers/fitmentController");
const {
	fitmentValidationRules,
	fitmentIdParamRule,
} = require("../validators/fitmentValidators");
const { validateApi } = require("../validators/validate");

const router = express.Router();

router.post("/", fitmentValidationRules, validateApi, createFitment);
router.delete("/:id", fitmentIdParamRule, validateApi, deleteFitment);

module.exports = router;
