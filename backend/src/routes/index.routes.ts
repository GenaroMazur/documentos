import { Router } from "express";
const router = Router()

import docsRouter from "./docs.routes"
import authRouter from "./auth.routes"

router.use("/documents",docsRouter)
router.use("/authorization",authRouter)


export default router