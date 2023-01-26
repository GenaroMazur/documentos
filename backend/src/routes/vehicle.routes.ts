import { Router } from "express";
import * as vehicleController from "../controllers/vehicleControllers"
import validationHandlerMiddleware from "../middlewares/validationHandlerMiddleware";
import { uploadVehicleChain } from "../middlewares/vehicleChainMiddleware";
const router = Router()

router.get("/", vehicleController.docsList)
router.post("/", uploadVehicleChain, validationHandlerMiddleware, vehicleController.docUp)
router.route("/:vehicleIdentifier")
    .get( vehicleController.docDetail)
    .delete( vehicleController.docDelete)
    .put( vehicleController.docUpdate)

export default router