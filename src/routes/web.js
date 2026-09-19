const express = require("express");
const partsWeb = require("../controllers/partsWebController");
const vehiclesWeb = require("../controllers/vehiclesWebController");
const fitmentWeb = require("../controllers/fitmentWebController");
const { partValidationRules } = require("../validators/partValidators");
const { vehicleValidationRules } = require("../validators/vehicleValidators");
const { fitmentValidationRules } = require("../validators/fitmentValidators");

const router = express.Router();

router.get("/", partsWeb.getDashboard);

router.get("/parts", partsWeb.listParts);
router.get("/parts/new", partsWeb.newPartForm);
router.post("/parts", partValidationRules, partsWeb.createPart);
router.get("/parts/:id", partsWeb.showPart);
router.get("/parts/:id/edit", partsWeb.editPartForm);
router.post("/parts/:id/update", partValidationRules, partsWeb.updatePart);
router.post("/parts/:id/delete", partsWeb.deletePart);

router.get("/vehicles", vehiclesWeb.listVehicles);
router.get("/vehicles/new", vehiclesWeb.newVehicleForm);
router.post("/vehicles", vehicleValidationRules, vehiclesWeb.createVehicle);
router.get("/vehicles/:id", vehiclesWeb.showVehicle);
router.get("/vehicles/:id/edit", vehiclesWeb.editVehicleForm);
router.post(
	"/vehicles/:id/update",
	vehicleValidationRules,
	vehiclesWeb.updateVehicle,
);
router.post("/vehicles/:id/delete", vehiclesWeb.deleteVehicle);

router.post("/fitment", fitmentValidationRules, fitmentWeb.createFitment);
router.post("/fitment/:id/delete", fitmentWeb.deleteFitment);

module.exports = router;
