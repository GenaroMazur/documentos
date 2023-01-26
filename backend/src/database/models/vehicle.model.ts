import { Schema, model } from "mongoose";
import { docInterface } from "../../interfaces/interfaces";

const VehicleDb = new Schema({
    vehicleDescription:{type: String, required:[true,"Es necesario descripcion del vehiculo"]},
    model:{type:String, required:[true,"ES necesario guardar modelo"]},
    identifier:{type:String, required:[true,"Es necesario guardar con un identificador"]},
    ownership:{type:String, required:[true,"Es necesario guardar el propietario"]},
    personInCharge:{type:String, require:[true, "es necesario guardar el responsable de la documentacion"]},
    document:{type: Array<docInterface>, required:[true,"Es necesario guardar con datos"] },
    
},{
    collection:"DOC_vehicle"
})

const mongooseHidden = require('mongoose-hidden')({ defaultHidden: {} })
VehicleDb.plugin(mongooseHidden)

export const VEHICLE = model("VEHICLE",VehicleDb)