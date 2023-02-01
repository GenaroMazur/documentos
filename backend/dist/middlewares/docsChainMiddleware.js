"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.docChain = void 0;
const express_validator_1 = require("express-validator");
exports.docChain = [
    (0, express_validator_1.body)("document")
        .notEmpty().withMessage("El campo 'document' no puede estar vacio").bail()
        // .isBase64().withMessage("El documento debe estar en formato 'base64'").bail()
        .isByteLength({ "max": 2 * Math.pow(10, 6) }).withMessage("El documento no debe pesar mas de 2 MegaBytes"),
    (0, express_validator_1.body)("documentType")
        .notEmpty().withMessage("El campo 'documentType' no puede estar vacio"),
    (0, express_validator_1.body)("expiredIn")
        .notEmpty().withMessage("El campo 'expiredIn' no puede estar vacio").bail()
        .custom((value, { req }) => {
        try {
            const dateArray = value.split("-");
            if (dateArray.length !== 3)
                throw new Error("La fecha no coincide con el formato yyyy-mm-dd");
            if (dateArray[0].length !== 4)
                throw new Error("La fecha no coincide con el formato yyyy-mm-dd");
            if (dateArray[1].length !== 2)
                throw new Error("La fecha no coincide con el formato yyyy-mm-dd");
            if (dateArray[2].length !== 2)
                throw new Error("La fecha no coincide con el formato yyyy-mm-dd");
            return true;
        }
        catch (error) {
            throw new Error(error.message);
        }
    })
];
