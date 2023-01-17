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
const xmlTojs_1 = __importDefault(require("./xmlTojs"));
const axios_1 = __importDefault(require("axios"));
// Get the drone observations from the drone API
function getObservations() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, axios_1.default)("https://assignments.reaktor.com/birdnest/drones");
                const xmlData = yield response.data;
                const data = yield (0, xmlTojs_1.default)(xmlData);
                let timestamp = data.report.capture.$.snapshotTimestamp;
                let date = new Date(timestamp);
                let arr = data.report.capture.drone;
                let observations = arr.map((observation) => {
                    return {
                        id: observation.serialNumber + "-" + date.getTime(),
                        serialNumber: observation.serialNumber,
                        timestamp: date,
                        positionX: parseInt(observation.positionX),
                        positionY: parseInt(observation.positionY),
                    };
                });
                resolve(observations);
                return;
            }
            catch (err) {
                console.error(err);
                reject("getObservationsData error");
            }
        }));
    });
}
exports.default = getObservations;
