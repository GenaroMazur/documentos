import { body } from "express-validator"
import { VEHICLE } from "../database/models/vehicle.model"
import { docInterface } from "../interfaces/interfaces"

export const uploadVehicleChain = [
    body("vehicleDescription")
        .notEmpty().withMessage("Es necesario completar el campo 'fileName'"),
    body("model")
        .notEmpty().withMessage("El campo 'model' no puede estar vacio").bail()
        .isString().withMessage("Debe ser una cadena de caracteres"),
    body("identifier")
        .notEmpty().withMessage("El campo 'identifier' no puede estar vacio").bail()
        .isString().withMessage("Debe ser una cadena de caracteres").bail()
        .custom((value,{req})=>{
            if(VEHICLE.findOne({identifier:value})!==null){
                throw new Error("No pueden haber 2 vehiculos con el mismo identificador")
            }else{
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
        .custom((value:Array<docInterface>,{req})=>{
            if(value===undefined || value.length===0) return true
            const condition = value.some(doc=>{
                return (doc.document===undefined || doc.documentType===undefined || doc.expiredIn === undefined)
            })
            if(condition){
                throw new Error("El campo 'documents' debe tener objetos validos")
            }else{
                return true
            }
        })
]

export const UpdateVehicle = [
    body("vehicleDescription")
        .isString().withMessage("Debe contener una cadena de caracteres"),
    body("model")
        .isString().withMessage("Debe contener una cadena de caracteres"),
    body("identifier")
        .notEmpty().withMessage("El campo 'identifier' no debe estar vacio")
        .isString().withMessage("Debe contener una cadena de caracteres")
        .custom(async(value,{req})=>{
            if(value){
                if(await VEHICLE.findOne({identifier:value})!==null) throw new Error("Ya estiste un vehiculo con ese identificador")
            }
            return true
        }),
    body("ownership")
        .isString().withMessage("Debe contener una cadena de caracteres"),
    body("personInCharge")
        .isString().withMessage("Debe contener una cadena de caracteres"),
    body("documents")
    .custom((value:Array<docInterface>,{req})=>{
        if(value===undefined || value.length===0) return true
        const condition = value.some(doc=>{
            return (doc.document===undefined || doc.documentType===undefined || doc.expiredIn === undefined)
        })
        if(condition){
            throw new Error("El campo 'documents' debe tener objetos validos")
        }else{
            return true
        }
    })
]