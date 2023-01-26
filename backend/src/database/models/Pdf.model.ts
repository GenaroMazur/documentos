import { Schema, model } from "mongoose";

const PdfDb = new Schema({
    documentType:{type:String, required:[true,"Es necesario guardar con un identificador de archivo"]},
    document:{type: String, required:[true,"Es necesario guardar con datos"] },
    expiredIn:{type: String, required:[true, "es necesario guardar con una fecha de expiracion"]},
    idVehicle:{type: IDBObjectStore, required:[true, "Es necesario un id de vehiculo"]},
    description:{type: String}
},{
    collection:"DOC_pdf"
})

const mongooseHidden = require('mongoose-hidden')({ defaultHidden: {} })
PdfDb.plugin(mongooseHidden)

export const DOC = model("DOC",PdfDb)