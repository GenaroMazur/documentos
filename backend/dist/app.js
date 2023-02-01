"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const morgan_1 = __importDefault(require("morgan"));
const server_1 = require("./server");
const succes_1 = require("./helpers/succes");
const index_routes_1 = __importDefault(require("./routes/index.routes"));
const server = server_1.SERVER.instance;
server.init();
server.start()
    .then((err) => {
    if (err)
        throw new Error("error al iniciar servidor") && console.log(err);
    server.app.use((0, morgan_1.default)("dev"));
    server.app.use(index_routes_1.default);
    server.app.use((req, res, next) => {
        return (0, succes_1.endpointResponse)({ res, status: false, code: 404, message: "endpoint no disponible o inexistente" });
    });
})
    .catch(() => {
    console.log("____________________________________________________");
});
