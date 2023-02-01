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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SERVER = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = require("./database/mongoose");
const cors_1 = __importDefault(require("cors"));
require("dotenv").config();
class SERVER {
    static get instance() { return this._instance || (this._instance = new this()); }
    constructor() {
        this.app = (0, express_1.default)();
        this.app.locals.users = [];
    }
    init() { return new SERVER(); }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const port = process.env.PORT;
                const urlDb = process.env.URLDB;
                const saltBcrypt = process.env.SALTBCRYPT;
                const jwtSecret = process.env.SECRETJWT;
                const sessionSecret = process.env.SESSIONSECRET;
                if (port === undefined || urlDb === undefined || saltBcrypt === undefined || jwtSecret === undefined || sessionSecret === undefined)
                    throw new Error("-------------- Faltan variables de entorno --------------");
                this.http = this.app.listen(port, () => {
                    console.log(`=============== Servidor en \x1b[32mlinea\x1b[0m Puerto ${port} ===============`);
                });
                (0, mongoose_1.mongoosedb)(urlDb);
                this.app.use(express_1.default.json());
                this.app.use(express_1.default.urlencoded({ extended: false }));
                this.app.use((0, cors_1.default)());
            }
            catch (error) {
                return error;
            }
        });
    }
    close() {
        var _a;
        (_a = this.http) === null || _a === void 0 ? void 0 : _a.close();
    }
}
exports.SERVER = SERVER;
