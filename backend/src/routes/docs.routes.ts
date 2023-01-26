import { Router } from "express";
import { upload } from "../middlewares/multerMiddleware";
import * as docs from "./../controllers/docsController"
const router = Router()

router.get("/",docs.docsList)
router.post("/",upload.array("",10),docs.docUp)
router.route("/:docName")
    .get(docs.docDetail)
    .delete(docs.docDelete)
    .put(upload.single(""),docs.docUpdate)

export default router