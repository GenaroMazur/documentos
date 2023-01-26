import { Router } from "express";
import * as vehicleController from "../controllers/vehicleControllers"
import validationHandlerMiddleware from "../middlewares/validationHandlerMiddleware";
import { uploadVehicleChain } from "../middlewares/vehicleChainMiddleware";
const router = Router()

router.get("/", vehicleController.vehicleList)
router.post("/", uploadVehicleChain, validationHandlerMiddleware, vehicleController.vehicleSave)
router.route("/:vehicleIdentifier")
    .get( vehicleController.vehicleDetail)
    .delete( vehicleController.docDelete)
    .put( vehicleController.docUpdate)

export default router