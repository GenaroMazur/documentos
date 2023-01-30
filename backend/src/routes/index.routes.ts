import { Router } from "express";
const router = Router()

import vehicleRouter from "./vehicle.routes"
import authRouter from "./auth.routes"
import mainRouter from "./main.routes"

router.use("/", mainRouter)
router.use("/vehicles",vehicleRouter)
router.use("/authorization",authRouter)


export default router