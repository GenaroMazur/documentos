"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const vehicle_routes_1 = __importDefault(require("./vehicle.routes"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const main_routes_1 = __importDefault(require("./main.routes"));
router.use("/", main_routes_1.default);
router.use("/vehicles", vehicle_routes_1.default);
router.use("/authorization", auth_routes_1.default);
exports.default = router;
