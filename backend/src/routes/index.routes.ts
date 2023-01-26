import { Router } from "express";
const router = Router()

import vehicleRouter from "./vehicle.routes"
import authRouter from "./auth.routes"

router.use("/documents",vehicleRouter)
router.use("/authorization",authRouter)


export default router