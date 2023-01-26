import { Router } from "express";
import * as docs from "./../controllers/docsController"
const router = Router()

router.get("/",docs.docsList)
router.post("/",docs.docUp)
router.route("/:docName")
    .get(docs.docDetail)
    .delete(docs.docDelete)
    .put(docs.docUpdate)

export default router