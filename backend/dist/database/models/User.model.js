"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const UserDb = new mongoose_1.Schema({
    username: { type: String, required: [true, "Nombre de usuario es requerido"] },
    password: { type: String, required: [true, "Contraseña de usuario es requerido"] },
    role: { type: String, required: [true, "El rol que ocupa es usuario es requerido"] },
    information: { type: Object }
}, {
    collection: "DOC_User"
});
const mongooseHidden = require('mongoose-hidden')({ defaultHidden: {} });
UserDb.plugin(mongooseHidden);
exports.User = (0, mongoose_1.model)("User", UserDb);
