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
exports.dateZoneString = exports.dateIsAfter = exports.dateIsBefore = exports.timestampToDate = exports.dateCustomToTimestamp = exports.dateCustom = exports.dateToTimestamp = exports.dateNowTimestamp = exports.dateNowFormat = exports.calculateDifDate = exports.countingHoursWorked = exports.resolveToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtSecret = process.env.SECRETJWT || "";
const resolveToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const objectOfToken = jsonwebtoken_1.default.verify(token, jwtSecret);
        return objectOfToken;
    }
    catch (error) {
        return null;
    }
});
exports.resolveToken = resolveToken;
const moment_1 = __importDefault(require("moment"));
const countingHoursWorked = (dateStart, dateFinish) => moment_1.default.duration((0, moment_1.default)((0, exports.timestampToDate)(dateStart, '')).diff((0, exports.timestampToDate)(dateFinish, ''))).asHours();
exports.countingHoursWorked = countingHoursWorked;
const calculateDifDate = (dateStart, dateFinish, type) => { let hour = moment_1.default.duration((0, moment_1.default)((0, exports.timestampToDate)(dateStart, '')).diff((0, exports.timestampToDate)(dateFinish, ''))); switch (type) {
    case 'days': return hour.asDays();
    case 'hour': return hour.asHours();
    case 'minutes': return hour.asMinutes();
    case 'seconds': return hour.asSeconds();
    default: return hour;
} };
exports.calculateDifDate = calculateDifDate;
const dateNowFormat = (format) => (0, moment_1.default)().format(format);
exports.dateNowFormat = dateNowFormat;
const dateNowTimestamp = () => (0, moment_1.default)().unix();
exports.dateNowTimestamp = dateNowTimestamp;
const dateToTimestamp = (date) => (0, moment_1.default)(date).unix();
exports.dateToTimestamp = dateToTimestamp;
const dateCustom = (date, format) => (0, moment_1.default)(date).format(format);
exports.dateCustom = dateCustom;
const dateCustomToTimestamp = (date, format) => (0, moment_1.default)(date, format).unix();
exports.dateCustomToTimestamp = dateCustomToTimestamp;
const timestampToDate = (date, format) => (0, moment_1.default)(new Date(date * 1000)).format(format);
exports.timestampToDate = timestampToDate;
const dateIsBefore = (date, dateToCompare, format) => (0, moment_1.default)(date, format).subtract(1, 'seconds').isBefore((0, moment_1.default)(dateToCompare, format));
exports.dateIsBefore = dateIsBefore;
const dateIsAfter = (date, dateToCompare, format) => (0, moment_1.default)(date, format).add(1, 'seconds').isAfter((0, moment_1.default)(dateToCompare, format));
exports.dateIsAfter = dateIsAfter;
const dateZoneString = (date, format, timeZone) => new Date(date * 1000).toLocaleString(format, { timeZone });
exports.dateZoneString = dateZoneString;
