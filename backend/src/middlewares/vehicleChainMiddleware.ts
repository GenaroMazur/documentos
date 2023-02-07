import { body } from "express-validator"
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
        .isString().withMessage("Debe ser una cadena de caracteres")
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
        .isString().withMessage("Debe contener una cadena de caracteres")
]