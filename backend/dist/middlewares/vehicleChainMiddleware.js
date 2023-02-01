"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateVehicle = exports.uploadVehicleChain = void 0;
const express_validator_1 = require("express-validator");
const vehicle_model_1 = require("../database/models/vehicle.model");
exports.uploadVehicleChain = [
    (0, express_validator_1.body)("vehicleDescription")
        .notEmpty().withMessage("Es necesario completar el campo 'vehicleDescription'"),
    (0, express_validator_1.body)("model")
        .notEmpty().withMessage("El campo 'model' no puede estar vacio").bail()
        .isString().withMessage("Debe ser una cadena de caracteres"),
    (0, express_validator_1.body)("identifier")
        .notEmpty().withMessage("El campo 'identifier' no puede estar vacio").bail()
        .isString().withMessage("Debe ser una cadena de caracteres").bail()
        .custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
        if ((yield vehicle_model_1.VEHICLE.findOne({ identifier: value })) !== null) {
            throw new Error("No pueden haber 2 vehiculos con el mismo identificador");
        }
        else {
            return true;
        }
    })),
    (0, express_validator_1.body)("ownership")
        .notEmpty().withMessage("El campo 'ownership' no puede estar vacio").bail()
        .isString().withMessage("Debe ser una cadena de caracteres").bail(),
    (0, express_validator_1.body)("personInCharge")
        .notEmpty().withMessage("El campo 'personInCharge' no puede estar vacio").bail()
        .isString().withMessage("Debe ser una cadena de caracteres"),
    (0, express_validator_1.body)("documents")
        .custom((value, { req }) => {
        if (value === undefined || value.length === 0)
            return true;
        try {
            const documents = JSON.parse(value);
            const condition = documents.some(doc => {
                return (doc.document === undefined || doc.documentType === undefined || doc.expiredIn === undefined);
            });
            if (condition) {
                throw new Error("1");
            }
            else {
                return true;
            }
        }
        catch (error) {
            throw new Error(error.message === "1" ? "El campo 'documents' debe tener los siguientes campos 'document', 'documentType', 'expiredIn' y 'description' (opcional) " : "El campo 'documents' debe ser un array con objetos validos");
        }
    })
];
exports.UpdateVehicle = [
    (0, express_validator_1.body)("_id")
        .notEmpty().withMessage("El campo '_id' no puede estar vacio"),
    (0, express_validator_1.body)("vehicleDescription")
        .notEmpty().withMessage("El campo 'vehicleDescription' no puede estar vacio").bail()
        .isString().withMessage("Debe contener una cadena de caracteres"),
    (0, express_validator_1.body)("model")
        .notEmpty().withMessage("El campo 'model' no puede estar vacio").bail()
        .isString().withMessage("Debe contener una cadena de caracteres"),
    (0, express_validator_1.body)("identifier")
        .notEmpty().withMessage("El campo 'identifier' no debe estar vacio")
        .isString().withMessage("Debe contener una cadena de caracteres")
        .custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
        if (value) {
            const vehicleDb = yield vehicle_model_1.VEHICLE.findOne({ identifier: value });
            if (vehicleDb !== null) {
                if (req.body._id !== vehicleDb._id.toString()) {
                    throw new Error("Ya estiste un vehiculo con ese identificador");
                }
            }
        }
        return true;
    })),
    (0, express_validator_1.body)("ownership")
        .notEmpty().withMessage("El campo 'ownership' no puede estar vacio").bail()
        .isString().withMessage("Debe contener una cadena de caracteres"),
    (0, express_validator_1.body)("personInCharge")
        .notEmpty().withMessage("El campo 'personInCharge' no puede estar vacio").bail()
        .isString().withMessage("Debe contener una cadena de caracteres"),
    (0, express_validator_1.body)("documents").optional()
        .custom((value, { req }) => {
        if (value === undefined || value.length === 0)
            return true;
        try {
            const documents = JSON.parse(value);
            const condition = documents.some(doc => {
                return (doc.document === undefined || doc.documentType === undefined || doc.expiredIn === undefined);
            });
            if (condition) {
                throw new Error("1");
            }
            else {
                return true;
            }
        }
        catch (error) {
            throw new Error(error.message === "1" ? "El campo 'documents' debe tener los siguientes campos 'document', 'documentType', 'expiredIn' y 'description' (opcional) " : "El campo 'documents' debe ser un array con objetos validos");
        }
    })
];
