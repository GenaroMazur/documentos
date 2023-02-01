"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoosedb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoosedb = (url) => {
    mongoose_1.default.set('strictQuery', false);
    mongoose_1.default.connect(url, (err) => {
        if (err)
            throw err;
        console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
    });
};
exports.mongoosedb = mongoosedb;
