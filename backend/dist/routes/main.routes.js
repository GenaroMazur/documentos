"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const docsController_1 = require("../controllers/docsController");
const router = (0, express_1.Router)();
router.get("/allDocs", docsController_1.allDocs);
router.get("/initialSync"); //endpoint de descarga de TODOS los archivos pdf 
exports.default = router;
