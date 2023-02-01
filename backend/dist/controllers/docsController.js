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
exports.allDocs = exports.deleteADocumentById = exports.updateDocById = exports.docById = exports.upDocument = exports.docsToCar = exports.docsExpiredList = void 0;
const catchAsync_1 = require("../helpers/catchAsync");
const http_errors_1 = __importDefault(require("http-errors"));
const vehicle_model_1 = require("../database/models/vehicle.model");
const succes_1 = require("../helpers/succes");
const helper_1 = require("../helpers/helper");
exports.docsExpiredList = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let query = {
        "$lte": (0, helper_1.dateZoneString)((0, helper_1.dateNowTimestamp)(), 'zu-ZA', 'America/Argentina/Cordoba').split(" ")[0],
        "$gte": (0, helper_1.dateZoneString)((0, helper_1.dateNowTimestamp)() - 60 * 60 * 24 * 30, 'zu-ZA', 'America/Argentina/Cordoba').split(" ")[0]
    };
    if (req.query.afterTo !== undefined) {
        query.$gte = req.query.afterTo;
        req.query.beforeTo === undefined ? delete query.$lte : null;
    }
    if (req.query.beforeTo !== undefined) {
        query.$lte = req.query.beforeTo;
        req.query.afterTo === undefined ? delete query.$gte : null;
    }
    try {
        let ArrayOfDocs = [];
        let documents = yield vehicle_model_1.VEHICLE.find({ "documents": { $elemMatch: { "expiredIn": query } } }).select({
            "documents": 1,
            "identifier": 1,
            "_id": 0
        });
        if (documents.length > 0) {
            ArrayOfDocs = documents.map((object) => {
                return object.documents.map((doc) => {
                    doc.identifier = object.identifier;
                    return doc;
                });
            })
                .reduce((response, docs) => response.concat(docs))
                .filter((doc) => {
                doc.document = undefined;
                if (query.$gte !== undefined && query.$lte !== undefined) {
                    return doc.expiredIn >= query.$gte && doc.expiredIn <= query.$lte;
                }
                else if (query.$gte !== undefined && query.$lte === undefined) {
                    return doc.expiredIn >= query.$gte;
                }
                else if (query.$gte === undefined && query.$lte !== undefined) {
                    return doc.expiredIn <= query.$lte;
                }
            });
        }
        (0, succes_1.endpointResponse)({ res, code: ArrayOfDocs.length === 0 ? 204 : 200, "message": "¡ Documentos expirados !", "body": ArrayOfDocs });
    }
    catch (error) {
        const httpError = (0, http_errors_1.default)(error.statusCode, `[Error retrieving documents expired list] - [docsExpired - GET]: ${error.message}`);
        return next(httpError);
    }
}));
exports.docsToCar = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vehicleIdentifier = req.params.vehicleIdentifier;
    try {
        const vehicle = yield vehicle_model_1.VEHICLE.findOne({ identifier: vehicleIdentifier }).select({ "documents": 1, "identifier": 1 });
        let docs = (vehicle === null || vehicle === void 0 ? void 0 : vehicle.documents) || [];
        let message = `¡ documentos del vehiculo ${vehicleIdentifier} !`;
        if (docs.length > 0) {
            if (req.query.expired === "true") {
                message = `¡ documentos vencidos del vehiculo ${vehicleIdentifier} !`;
                docs = docs.filter((doc) => {
                    return doc.expiredIn <= (0, helper_1.dateZoneString)((0, helper_1.dateNowTimestamp)(), 'zu-ZA', 'America/Argentina/Cordoba').split(" ")[0];
                });
            }
            docs.map((doc) => {
                doc.document = undefined;
                return doc;
            });
        }
        (0, succes_1.endpointResponse)({ res, code: docs.length === 0 ? 204 : 200, message, body: docs });
    }
    catch (error) {
        const httpError = (0, http_errors_1.default)(error.statusCode, `[Error retrieving vehicle documents list] - [${vehicleIdentifier}/documents - GET]: ${error.message}`);
        return next(httpError);
    }
}));
exports.upDocument = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vehicleIdentifier = req.params.vehicleIdentifier;
    try {
        const document = {
            "document": req.body.document,
            "documentType": req.body.documentType,
            "expiredIn": req.body.expiredIn,
            "description": req.body.description,
            "lastUpdated": (0, helper_1.dateZoneString)((0, helper_1.dateNowTimestamp)(), 'zu-ZA', 'America/Argentina/Cordoba').split(" ")[0]
        };
        yield vehicle_model_1.VEHICLE.findOneAndUpdate({ identifier: vehicleIdentifier }, { "$push": { "documents": document } });
        (0, succes_1.endpointResponse)({ res, code: 201, message: "¡ Documento agregado al vehiculo !", body: document });
    }
    catch (error) {
        const httpError = (0, http_errors_1.default)(error.statusCode, `[Error retrieving vehicle up document] - [${vehicleIdentifier}/documents - POST]: ${error.message}`);
        return next(httpError);
    }
}));
exports.docById = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const vehicleIdentifier = req.params.vehicleIdentifier;
    const documentId = req.params.documentId;
    try {
        const doc = (_a = (yield vehicle_model_1.VEHICLE.findOne({ "documents._id": documentId }, { "documents.$": 1 }))) === null || _a === void 0 ? void 0 : _a.documents[0];
        (0, succes_1.endpointResponse)({ res, code: 200, message: "¡ Documento encontrado !", body: doc });
    }
    catch (error) {
        const httpError = (0, http_errors_1.default)(error.statusCode, `[Error retrieving vehicle search a document] - [${vehicleIdentifier}/documents/${documentId} - PUT]: ${error.message}`);
        return next(httpError);
    }
}));
exports.updateDocById = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vehicleIdentifier = req.params.vehicleIdentifier;
    const documentId = req.params.documentId;
    try {
        const document = {
            "documents.$.document": req.body.document,
            "documents.$.documentType": req.body.documentType,
            "documents.$.expiredIn": req.body.expiredIn,
            "documents.$.description": req.body.description,
            "documents.$.lastUpdated": (0, helper_1.dateZoneString)((0, helper_1.dateNowTimestamp)(), 'zu-ZA', 'America/Argentina/Cordoba').split(" ")[0]
        };
        yield vehicle_model_1.VEHICLE.findOneAndUpdate({ "documents._id": documentId }, document);
        (0, succes_1.endpointResponse)({ res, message: "documento actualizado" });
    }
    catch (error) {
        const httpError = (0, http_errors_1.default)(error.statusCode, `[Error retrieving vehicle update document] - [${vehicleIdentifier}/documents/${documentId} - PUT]: ${error.message}`);
        return next(httpError);
    }
}));
exports.deleteADocumentById = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vehicleIdentifier = req.params.vehicleIdentifier;
    const documentId = req.params.documentId;
    try {
        yield vehicle_model_1.VEHICLE.findOneAndUpdate({ "identifier": vehicleIdentifier }, { "$pull": { "documents": { "_id": documentId } } });
        (0, succes_1.endpointResponse)({ res, message: "Documento Eliminado" });
    }
    catch (error) {
        const httpError = (0, http_errors_1.default)(error.statusCode, `[Error retrieving vehicle delete a document] - [${vehicleIdentifier}/documents/${documentId} - DELETE]: ${error.message}`);
        return next(httpError);
    }
}));
exports.allDocs = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vehicles = yield vehicle_model_1.VEHICLE.find().select({ documents: 1, identifier: 1 });
        let ArrayOfDocs = vehicles.map((object) => {
            return object.documents.map((doc) => {
                doc.identifier = object.identifier;
                doc.document = undefined;
                doc.linkDetail = `/vehicles/${doc.identifier}/documents/${doc._id}`;
                return doc;
            });
        });
        ArrayOfDocs = ArrayOfDocs.reduce((response, docs) => response.concat(docs));
        (0, succes_1.endpointResponse)({ res, code: 200, message: "List of all docs", body: ArrayOfDocs });
    }
    catch (error) {
        console.log(error);
        const httpError = (0, http_errors_1.default)(error.statusCode, `[Error retrieving list of All docs] - [/allDocs - GET]: ${error.message}`);
        return next(httpError);
    }
}));
