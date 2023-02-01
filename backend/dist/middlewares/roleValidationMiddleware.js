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
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../helpers/helper");
const catchAsync_1 = require("../helpers/catchAsync");
const succes_1 = require("../helpers/succes");
const roleValidationMiddleware = (only = "USER") => {
    return (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        if (req.headers["authorization"] === undefined)
            return (0, succes_1.endpointResponse)({ res, "code": 402, "message": "¡ No cuenta con un token !" });
        const token = req.headers["authorization"].split(" ");
        if (token[0].toLowerCase() !== "bearer")
            return (0, succes_1.endpointResponse)({ res, "code": 402, "message": "¡ Token no valido !" });
        const resolvedToken = yield (0, helper_1.resolveToken)(token[1]);
        if (resolvedToken === null)
            return (0, succes_1.endpointResponse)({ res, "code": 402, "message": "¡ Token no valido !" });
        switch (only) {
            case "ADMIN":
                if (resolvedToken.role === "USER" || resolvedToken.role === "DRIVER")
                    return (0, succes_1.endpointResponse)({ res, "code": 401, "message": "¡ No autorizado !" });
                break;
            case "DRIVER":
                if (resolvedToken.role === "USER")
                    return (0, succes_1.endpointResponse)({ res, "code": 401, "message": "¡ No autorizado !" });
                break;
        }
        return next();
    }));
};
exports.default = roleValidationMiddleware;
