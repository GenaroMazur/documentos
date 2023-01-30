import { Router } from "express";
import { docsExpiredList, docsToCar, upDocument } from "../controllers/docsController";
import {vehicleDelete, vehicleList, vehicleDetail, vehicleSave, vehicleUpdate} from "../controllers/vehicleControllers"
import roleValidationMiddleware from "../middlewares/roleValidationMiddleware";
import validationHandlerMiddleware from "../middlewares/validationHandlerMiddleware";
import { UpdateVehicle, uploadVehicleChain } from "../middlewares/vehicleChainMiddleware";
const router = Router()

router.get("/", vehicleList)
router.get("/docsExpirated",docsExpiredList)
router.post("/",roleValidationMiddleware("ADMIN"), uploadVehicleChain, validationHandlerMiddleware, vehicleSave)
router.route("/:vehicleIdentifier")
    .get( vehicleDetail)
    .delete(roleValidationMiddleware("ADMIN") , vehicleDelete)
    .put(roleValidationMiddleware("ADMIN"), UpdateVehicle, validationHandlerMiddleware, vehicleUpdate)
router.route("/:vehicleIdentifier/documents")
    .get(docsToCar)
    .post(roleValidationMiddleware("ADMIN"), upDocument)
    .put(roleValidationMiddleware("ADMIN"), )
    .delete(roleValidationMiddleware("ADMIN"), )
router.route("/:vehicleIdentifier/documents/:documentId")
    .get()
    .put(roleValidationMiddleware("ADMIN"), )
    .delete(roleValidationMiddleware("ADMIN"), )
    
export default router