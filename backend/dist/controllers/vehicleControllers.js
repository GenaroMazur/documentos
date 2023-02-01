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
exports.vehicleUpdate = exports.vehicleDelete = exports.vehicleSave = exports.vehicleDetail = exports.vehicleList = void 0;
const catchAsync_1 = require("../helpers/catchAsync");
const succes_1 = require("../helpers/succes");
const http_errors_1 = __importDefault(require("http-errors"));
const vehicle_model_1 = require("../database/models/vehicle.model");
exports.vehicleList = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vehicle = yield vehicle_model_1.VEHICLE.find().select({
            "documents": 0,
            "_id": 0
        });
        (0, succes_1.endpointResponse)({ res, code: vehicle.length === 0 ? 204 : 200, "message": "¡ Lista de vehiculos !", "body": vehicle });
    }
    catch (error) {
        const httpError = (0, http_errors_1.default)(error.statusCode, `[Error retrieving vehicles list] - [vehicles - GET]: ${error.message}`);
        return next(httpError);
    }
}));
exports.vehicleDetail = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vehicle = yield vehicle_model_1.VEHICLE.findOne({ identifier: req.params.vehicleIdentifier });
        vehicle === null || vehicle === void 0 ? void 0 : vehicle.documents.map((doc) => {
            doc.document = undefined;
            return doc;
        });
        (0, succes_1.endpointResponse)({ res, "code": vehicle === null ? 204 : 200, "message": "¡Detalle de vehiculo!", "body": vehicle });
    }
    catch (error) {
        const httpError = (0, http_errors_1.default)(error.statusCode, `[Error retrieving Vehicel detail] - [vehicle - ${req.params.vehicleIdentifier} - GET]: ${error.message}`);
        return next(httpError);
    }
}));
exports.vehicleSave = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vehicle = {
            "vehicleDescription": req.body.vehicleDescription,
            "model": req.body.model,
            "identifier": req.body.identifier,
            "ownership": req.body.ownership,
            "personInCharge": req.body.personInCharge,
            "documents": []
        };
        yield vehicle_model_1.VEHICLE.create(vehicle);
        (0, succes_1.endpointResponse)({ res, "code": 201, "message": "¡ vehiculo creado !", "body": vehicle });
    }
    catch (error) {
        const httpError = (0, http_errors_1.default)(error.statusCode, `[Error retrieving Vehicel Save] - [vehicle - ${req.params.vehicleIdentifier} - POST]: ${error.message}`);
        return next(httpError);
    }
}));
exports.vehicleDelete = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vehicleIdentifier = req.params.vehicleIdentifier;
        yield vehicle_model_1.VEHICLE.findOneAndRemove({ identifier: vehicleIdentifier });
        (0, succes_1.endpointResponse)({ res, "code": 200, "message": "¡ Vehiculo eliminado !" });
    }
    catch (error) {
        const httpError = (0, http_errors_1.default)(error.statusCode, `[Error retrieving Vehicel delete] - [vehicle - ${req.params.vehicleIdentifier} - DELETE]: ${error.message}`);
        return next(httpError);
    }
}));
exports.vehicleUpdate = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vehicle = {
            "vehicleDescription": req.body.vehicleDescription,
            "model": req.body.model,
            "identifier": req.body.identifier,
            "ownership": req.body.ownership,
            "personInCharge": req.body.personInCharge,
        };
        yield vehicle_model_1.VEHICLE.findOneAndUpdate({ identifier: vehicle.identifier }, vehicle);
        (0, succes_1.endpointResponse)({ res, "message": "¡ Se actualizo con exito !", "body": vehicle, code: 201 });
    }
    catch (error) {
        const httpError = (0, http_errors_1.default)(error.statusCode, `[Error retrieving Vehicel update] - [vehicle - ${req.params.vehicleIdentifier} - PUT]: ${error.message}`);
        return next(httpError);
    }
}));
