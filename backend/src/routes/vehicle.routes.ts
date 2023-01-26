import { Router } from "express";
import * as vehicleController from "../controllers/vehicleControllers"
import validationHandlerMiddleware from "../middlewares/validationHandlerMiddleware";
import { UpdateVehicle, uploadVehicleChain } from "../middlewares/vehicleChainMiddleware";
const router = Router()

router.get("/", vehicleController.vehicleList)
router.get("/docsExpirated")
router.post("/", uploadVehicleChain, validationHandlerMiddleware, vehicleController.vehicleSave)
router.route("/:vehicleIdentifier")
    .get( vehicleController.vehicleDetail)
    .get( vehicleController.vehicleDetail)
    .delete( vehicleController.vehicleDelete)
    .put(UpdateVehicle, validationHandlerMiddleware, vehicleController.vehicleUpdate)
router.route("/:vehicleIdentifier/documents")
    .get()
    .post()
    .put()
    .delete()

export default router