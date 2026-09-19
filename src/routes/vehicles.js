const express = require("express");
const {
	getVehicles,
	getVehicleById,
	createVehicle,
	updateVehicle,
	deleteVehicle,
	getPartsForVehicle,
} = require("../controllers/vehiclesController");
const {
	vehicleValidationRules,
	vehicleIdParamRule,
} = require("../validators/vehicleValidators");
const { validateApi } = require("../validators/validate");

const router = express.Router();

router.get("/", getVehicles);
router.get("/:id", vehicleIdParamRule, validateApi, getVehicleById);
router.get("/:id/parts", vehicleIdParamRule, validateApi, getPartsForVehicle);
router.post("/", vehicleValidationRules, validateApi, createVehicle);
router.put(
	"/:id",
	vehicleIdParamRule,
	vehicleValidationRules,
	validateApi,
	updateVehicle,
);
router.delete("/:id", vehicleIdParamRule, validateApi, deleteVehicle);

module.exports = router;
