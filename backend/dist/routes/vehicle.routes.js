"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const docsController_1 = require("../controllers/docsController");
const vehicleControllers_1 = require("../controllers/vehicleControllers");
const docsChainMiddleware_1 = require("../middlewares/docsChainMiddleware");
const roleValidationMiddleware_1 = __importDefault(require("../middlewares/roleValidationMiddleware"));
const validationHandlerMiddleware_1 = __importDefault(require("../middlewares/validationHandlerMiddleware"));
const vehicleChainMiddleware_1 = require("../middlewares/vehicleChainMiddleware");
const router = (0, express_1.Router)();
router.get("/", vehicleControllers_1.vehicleList);
router.get("/docsExpirated", docsController_1.docsExpiredList);
router.post("/", (0, roleValidationMiddleware_1.default)("ADMIN"), vehicleChainMiddleware_1.uploadVehicleChain, validationHandlerMiddleware_1.default, vehicleControllers_1.vehicleSave);
router.route("/:vehicleIdentifier")
    .get(vehicleControllers_1.vehicleDetail)
    .delete((0, roleValidationMiddleware_1.default)("ADMIN"), vehicleControllers_1.vehicleDelete)
    .put((0, roleValidationMiddleware_1.default)("ADMIN"), vehicleChainMiddleware_1.UpdateVehicle, validationHandlerMiddleware_1.default, vehicleControllers_1.vehicleUpdate);
router.route("/:vehicleIdentifier/documents")
    .get(docsController_1.docsToCar)
    .post((0, roleValidationMiddleware_1.default)("ADMIN"), docsChainMiddleware_1.docChain, validationHandlerMiddleware_1.default, docsController_1.upDocument);
router.route("/:vehicleIdentifier/documents/:documentId")
    .get(docsController_1.docById)
    .put((0, roleValidationMiddleware_1.default)("ADMIN"), docsController_1.updateDocById)
    .delete((0, roleValidationMiddleware_1.default)("ADMIN"), docsController_1.deleteADocumentById);
exports.default = router;
