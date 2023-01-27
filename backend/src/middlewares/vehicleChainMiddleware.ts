import { body, ErrorFormatter } from "express-validator"
import { } from "mongoose"
import { VEHICLE } from "../database/models/vehicle.model"
import { docInterface } from "../interfaces/interfaces"

export const uploadVehicleChain = [
    body("vehicleDescription")
        .notEmpty().withMessage("Es necesario completar el campo 'vehicleDescription'"),
    body("model")
        .notEmpty().withMessage("El campo 'model' no puede estar vacio").bail()
        .isString().withMessage("Debe ser una cadena de caracteres"),
    body("identifier")
        .notEmpty().withMessage("El campo 'identifier' no puede estar vacio").bail()
        .isString().withMessage("Debe ser una cadena de caracteres").bail()
        .custom(async (value, { req }) => {
            if (await VEHICLE.findOne({ identifier: value }) !== null) {


                throw new Error("No pueden haber 2 vehiculos con el mismo identificador")
            } else {
                return true
            }
        }),
    body("ownership")
        .notEmpty().withMessage("El campo 'ownership' no puede estar vacio").bail()
        .isString().withMessage("Debe ser una cadena de caracteres").bail(),
    body("personInCharge")
        .notEmpty().withMessage("El campo 'personInCharge' no puede estar vacio").bail()
        .isString().withMessage("Debe ser una cadena de caracteres"),
    body("documents")
        .custom((value, { req }) => {
            if (value === undefined || value.length === 0) return true
            try {
                
                const documents :Array<docInterface> = JSON.parse(value)
                const condition = documents.some(doc => {
                    return (doc.document === undefined || doc.documentType === undefined || doc.expiredIn === undefined)
                })
                
                if (condition) {
                    throw new Error("1")
                } else {
                    return true
                }
            } catch (error:any) {
                throw new Error(error.message==="1"?"El campo 'documents' debe tener los siguientes campos 'document', 'documentType', 'expiredIn' y 'description' (opcional) ":"El campo 'documents' debe ser un array con objetos validos")
            }
        })
]

export const UpdateVehicle = [
    body("_id")
        .notEmpty().withMessage("El campo '_id' no puede estar vacio"),
    body("vehicleDescription")
        .notEmpty().withMessage("El campo 'vehicleDescription' no puede estar vacio").bail()
        .isString().withMessage("Debe contener una cadena de caracteres"),
    body("model")
        .notEmpty().withMessage("El campo 'model' no puede estar vacio").bail()
        .isString().withMessage("Debe contener una cadena de caracteres"),
    body("identifier")
        .notEmpty().withMessage("El campo 'identifier' no debe estar vacio")
        .isString().withMessage("Debe contener una cadena de caracteres")
        .custom(async (value, { req }) => {
            if (value) {
                const vehicleDb = await VEHICLE.findOne({ identifier: value })
                if (vehicleDb !== null) {
                    if (req.body._id !== vehicleDb._id.toString()) {
                        throw new Error("Ya estiste un vehiculo con ese identificador")
                    }
                }
            }
            return true
        }),
    body("ownership")
        .notEmpty().withMessage("El campo 'ownership' no puede estar vacio").bail()
        .isString().withMessage("Debe contener una cadena de caracteres"),
    body("personInCharge")
        .notEmpty().withMessage("El campo 'personInCharge' no puede estar vacio").bail()
        .isString().withMessage("Debe contener una cadena de caracteres"),
    body("documents").optional()
        .custom((value:any, { req }) => {
            if (value === undefined || value.length === 0) return true
            try {
                
                const documents :Array<docInterface> = JSON.parse(value)
                const condition = documents.some(doc => {
                    return (doc.document === undefined || doc.documentType === undefined || doc.expiredIn === undefined)
                })
                
                if (condition) {
                    throw new Error("1")
                } else {
                    return true
                }
            } catch (error:any) {
                throw new Error(error.message==="1"?"El campo 'documents' debe tener los siguientes campos 'document', 'documentType', 'expiredIn' y 'description' (opcional) ":"El campo 'documents' debe ser un array con objetos validos")
            }
        })
]