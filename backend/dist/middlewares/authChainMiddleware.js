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
exports.registerChainValidator = exports.loginChainValidator = void 0;
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_model_1 = require("../database/models/User.model");
const letters = "abcdefghijklmnñopqrstuvwxyz";
const nums = "0123456789";
exports.loginChainValidator = [
    (0, express_validator_1.body)("username")
        .notEmpty().withMessage("El campo 'username' no puede estar vacio").bail()
        .custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield User_model_1.User.findOne({ username: value });
        if (user !== null) {
            req.app.locals.users.push(user);
        }
        else {
            throw new Error("No existe este usuario");
        }
        return true;
    })),
    (0, express_validator_1.body)("password")
        .notEmpty().withMessage("El campo 'password' no puede estar vacio").bail()
        .custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
        if (req.body.username === undefined)
            return true;
        if (req.app.locals.users === undefined)
            return true;
        const user = req.app.locals.users.find((user) => user.username === req.body.username);
        if (user === undefined)
            return true;
        if (!bcrypt_1.default.compareSync(value, user.password)) {
            throw new Error("Contraseña incorrecta");
        }
        return true;
    }))
];
exports.registerChainValidator = [
    (0, express_validator_1.body)("username")
        .notEmpty().withMessage("El campo 'username' no puede estar vacio").bail()
        .isLength({ min: 4, max: 16 }).withMessage("El nombre de usuario debe ser mañor de 4 y menor de 16 caracteres").bail()
        .custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
        const userInDb = yield User_model_1.User.findOne({ username: value });
        if (userInDb !== null)
            throw new Error("Ya existe un usuario con ese nombre");
        return true;
    })),
    (0, express_validator_1.body)("password")
        .notEmpty().withMessage("El campo 'password' no puede estar vacio").bail()
        .isLength({ min: 8 }).withMessage("La constraseña no debe ser menor de 8 digitos").bail()
        .custom((value, { req }) => {
        let passwordRequires = {
            min: false,
            mayus: false,
            nums: false
        };
        if (letters.split("").some(letter => value.includes(letter)))
            passwordRequires.min = true;
        if (letters.toUpperCase().split("").some(letter => value.includes(letter)))
            passwordRequires.mayus = true;
        if (nums.split("").some(num => value.includes(num)))
            passwordRequires.nums = true;
        if (!passwordRequires.min)
            throw new Error("La contraseña debe contener letras minusculas");
        if (!passwordRequires.mayus)
            throw new Error("La contraseña debe contener letras mayusculas");
        if (!passwordRequires.nums)
            throw new Error("La contraseña debe contener numeros");
        return true;
    }),
    (0, express_validator_1.body)("document")
        .notEmpty().withMessage("El campo 'document' no puede estar vacio").bail()
        .isInt({ "min": 999999 }).withMessage("El campo 'document' debe ser un numero valido").bail(),
    (0, express_validator_1.body)("firstName")
        .notEmpty().withMessage("El campo 'firstName' no puede estar vacio").bail(),
    (0, express_validator_1.body)("lastName")
        .notEmpty().withMessage("El campo 'lastName' no puede estar vacio"),
    (0, express_validator_1.body)("email")
        .isEmail().withMessage("El campo 'email' debe ser un correo valido"),
    (0, express_validator_1.body)("role")
        .notEmpty().withMessage("El campo 'role' no debe estar vacio").bail()
        .isString().withMessage("El campo de rol debe ser un string").bail()
        .custom((value, { req }) => {
        if (value !== "USER" && value !== "ADMIN" && value !== "DRIVER")
            throw new Error("El campo rol solo puede tener 3 valores posibles : 'USER','ADMIN','DRIVER'");
        return true;
    })
];
