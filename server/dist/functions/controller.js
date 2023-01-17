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
const axios_1 = __importDefault(require("axios"));
const client_1 = require("@prisma/client");
const getObservations_1 = __importDefault(require("./getObservations"));
const uploadOrUpdatePilot_1 = __importDefault(require("./uploadOrUpdatePilot"));
const prisma = new client_1.PrismaClient();
// Axios config, allows 404 status codes. Needed because pilot data is not available for all drones
let axiosConf = {};
axiosConf.validateStatus = (status) => {
    return (status >= 200 && status < 300) || status == 404;
};
//Distance between the birdnest and a drone
function distance(observation) {
    const x = observation.positionX / 1000 - 250;
    const y = observation.positionY / 1000 - 250;
    const d = Math.sqrt(x * x + y * y);
    return d;
}
// Uploads pilot data to mariaDB, returns promise with latest drone observations and all pilot data
// The observation data will be stripped of any identifying information
function Controller() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const observations = yield (0, getObservations_1.default)();
                console.log("Observations fetched");
                for (let observation of observations) {
                    const distanceToNest = distance(observation);
                    // look for pilot in database
                    let pilot = yield prisma.pilot.findUnique({
                        where: {
                            serialNumber: observation.serialNumber,
                        },
                    });
                    if (distanceToNest >= 100 && !pilot) {
                        // The pilot does not exist in the database and is not in violation of the 100m rule
                        continue;
                    }
                    if (pilot) {
                        // The pilot exists in the database, therefore a recent offender and is updated in the database
                        pilot.lastSeen = observation.timestamp;
                        if (distanceToNest < 100) {
                            pilot.lastViolation = observation.timestamp;
                            pilot.closestDistance = Math.min(distanceToNest, pilot.closestDistance);
                        }
                        yield (0, uploadOrUpdatePilot_1.default)(pilot);
                        continue;
                    }
                    // If we get here, the pilot does not exist in the database and is in violation of the 100m rule
                    // Fetching pilot data from the pilot API
                    const apiResponse = yield (0, axios_1.default)(`https://assignments.reaktor.com/birdnest/pilots/${observation.serialNumber}`, axiosConf);
                    if (apiResponse.status === 404) {
                        //Pilot API not responding, creating dummy pilot
                        pilot = {
                            serialNumber: observation.serialNumber,
                            firstName: "Unknown",
                            lastName: "Unknown",
                            phoneNumber: "Unknown",
                            email: "Unknown",
                            lastSeen: observation.timestamp,
                            lastViolation: observation.timestamp,
                            closestDistance: distanceToNest,
                        };
                    }
                    else {
                        const pilotData = apiResponse.data;
                        pilot = {
                            serialNumber: observation.serialNumber,
                            firstName: pilotData.firstName,
                            lastName: pilotData.lastName,
                            phoneNumber: pilotData.phoneNumber,
                            email: pilotData.email,
                            lastSeen: observation.timestamp,
                            lastViolation: observation.timestamp,
                            closestDistance: distanceToNest,
                        };
                    }
                    if (!pilot) {
                        throw new Error("Controller: pilot is null");
                    }
                    else {
                        yield (0, uploadOrUpdatePilot_1.default)(pilot);
                    }
                }
                const pilots = yield prisma.pilot.findMany();
                // Removing identifying information, i.e. serialNumber, from the observations before sending them to the client
                const sanitizedObservations = observations.map((observation) => {
                    return {
                        timestamp: observation.timestamp,
                        positionX: observation.positionX,
                        positionY: observation.positionY,
                    };
                });
                resolve([sanitizedObservations, pilots]);
            }
            catch (err) {
                console.error(err);
                reject("Controller error");
            }
        }));
    });
}
exports.default = Controller;
