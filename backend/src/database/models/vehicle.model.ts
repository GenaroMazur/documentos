import { Schema, model } from "mongoose";
import { docInterface } from "../../interfaces/interfaces";

const Document = new Schema({
    documentId:{type: Schema.Types.ObjectId, required:[true, "es necesario un id"]},
    document:{type:String, required:[true,"Es necesario ingresar el documento en base64"]},
    expiredIn:{type:String, required:[true,"Es necesario una fecha de expiracion"]},
    description:{type:String},
    documentType:{type:String, required:[true,"Es necesario especificar que tipo de documento es"]},
    lastUpdated:{type: String, required:[true, "Es necesario especificar cuando fue actualizado"]},
    identifier:{type:String},
    linkDetail:{type:String}
})

const VehicleDb = new Schema({
    vehicleDescription:{type: String, required:[true,"Es necesario descripcion del vehiculo"]},
    model:{type:String, required:[true,"ES necesario guardar modelo"]},
    identifier:{type:String, required:[true,"Es necesario guardar con un identificador"]},
    ownership:{type:String, required:[true,"Es necesario guardar el propietario"]},
    personInCharge:{type:String, require:[true, "es necesario guardar el responsable de la documentacion"]},
    documents:{type: [Document] , required:[true,"Es necesario guardar con datos"] }
    
},{
    collection:"DOC_vehicle",
    versionKey: false
})

const mongooseHidden = require('mongoose-hidden')({ defaultHidden: {} })
VehicleDb.plugin(mongooseHidden)

export const VEHICLE = model("VEHICLE",VehicleDb)