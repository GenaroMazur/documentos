import { Router } from "express";
import { allDocs } from "../controllers/docsController";
const router = Router()

router.get("/allDocs",allDocs)
router.get("/initialSync") //endpoint de descarga de TODOS los archivos pdf 

export default router