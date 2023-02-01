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
exports.register = exports.login = void 0;
const catchAsync_1 = require("../helpers/catchAsync");
const http_errors_1 = __importDefault(require("http-errors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const succes_1 = require("../helpers/succes");
const User_model_1 = require("../database/models/User.model");
const jwtSecret = process.env.SECRETJWT || "";
const saltBcrypt = parseInt(process.env.SALTBCRYPT || "0");
exports.login = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        const user = req.app.locals.users.find((user) => user.username === req.body.username);
        const objectToToken = {
            "username": user.username,
            "firstName": ((_a = user.information) === null || _a === void 0 ? void 0 : _a.firstName) || "",
            "lastName": ((_b = user.information) === null || _b === void 0 ? void 0 : _b.lastName) || "",
            "document": ((_c = user.information) === null || _c === void 0 ? void 0 : _c.document) || 0,
            "email": ((_d = user.information) === null || _d === void 0 ? void 0 : _d.email) || "",
            "role": user.role || "USER",
            "cellphone": (_e = user.information) === null || _e === void 0 ? void 0 : _e.cellphone
        };
        let token;
        if (user.username === "administrador") {
            token = jsonwebtoken_1.default.sign(objectToToken, jwtSecret, { "expiresIn": "14d" });
        }
        else {
            token = jsonwebtoken_1.default.sign(objectToToken, jwtSecret, { "expiresIn": "1d" });
        }
        return (0, succes_1.endpointResponse)({ res, "code": 200, "message": "¡ Inicio de sesion exitoso !", "body": { token: "Bearer " + token } });
    }
    catch (error) {
        const httpError = (0, http_errors_1.default)(error.statusCode, `[Error retrieving login] - [login - POST]: ${error.message}`);
        return next(httpError);
    }
}));
exports.register = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = {
            "username": req.body.username,
            "password": bcrypt_1.default.hashSync(req.body.password, saltBcrypt),
            "role": req.body.role,
            "information": {
                "document": req.body.document,
                "firstName": req.body.firstName,
                "lastName": req.body.lastName,
                "email": req.body.email,
                "cellphone": req.body.cellphone
            }
        };
        yield User_model_1.User.create(user);
        return (0, succes_1.endpointResponse)({ res, "message": "¡ Registrado con exito !", code: 201 });
    }
    catch (error) {
        const httpError = (0, http_errors_1.default)(error.statusCode, `[Error retrieving register] - [register - POST]: ${error.message}`);
        return next(httpError);
    }
}));
