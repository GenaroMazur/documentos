import { Schema, model } from "mongoose";

const UserDb = new Schema({
    username:{type: String, required:[true,"Nombre de usuario es requerido"]},
    password:{type: String, required:[true,"Contraseña de usuario es requerido"]},
    role:{type:String, required:[true,"El rol que ocupa es usuario es requerido"]},
    information:{type: Object}
},{
    collection:"DOC_User"
})

const mongooseHidden = require('mongoose-hidden')({ defaultHidden: {} })
UserDb.plugin(mongooseHidden)

export const User = model("User",UserDb)