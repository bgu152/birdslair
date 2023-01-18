import axios, { AxiosRequestConfig } from "axios";
import { PrismaClient } from "@prisma/client";
import { Pilot } from "@prisma/client";
import { Observation, SanitizedObservation } from "../types";
import getObservations from "./getObservations";
import uploadOrUpdatePilot from "./uploadOrUpdatePilot";
const prisma = new PrismaClient();

// Axios config, allows 404 status codes. Needed because pilot data is not available for all drones
let axiosConf: AxiosRequestConfig = {};
axiosConf.validateStatus = (status: number) => {
    return (status >= 200 && status < 300) || status == 404;
};

//Distance between the birdnest and a drone
function distance(observation: Observation): number {
    const x = observation.positionX / 1000 - 250;
    const y = observation.positionY / 1000 - 250;
    const d = Math.sqrt(x * x + y * y);
    return d;
}

// Updates pilot data in the database, returns promise with latest drone observations and all pilot data
// The drone observation data will be stripped of any identifying information before being sent to the client
async function controller(): Promise<[SanitizedObservation[], Pilot[]]> {
    return new Promise(async (resolve, reject) => {
        try {
            const observations = await getObservations();
            console.log("Observations fetched");

            for (let observation of observations) {
                const distanceToNest = distance(observation);

                // look for pilot in database matching the serial number of the drone
                let pilot: Pilot | null = await prisma.pilot.findUnique({
                    where: {
                        serialNumber: observation.serialNumber,
                    },
                });

                if (distanceToNest >= 100 && !pilot) {
                    // The pilot does not exist in the database and is not in violation of the 100m rule
                    continue;
                }

                if (pilot) {
                    // The pilot exists in the database, therefore a recent offender and the database needs to be updated
                    pilot.lastSeen = observation.timestamp;
                    if (distanceToNest < 100) {
                        pilot.lastViolation = observation.timestamp;
                        pilot.closestDistance = Math.min(distanceToNest, pilot.closestDistance);
                    }
                    await uploadOrUpdatePilot(pilot);
                    continue;
                }

                // If we get here, the pilot does not exist in the database and is in violation of the 100m rule
                // We store a new pilot in the database

                // Fetching pilot data from the pilot API
                const apiResponse = await axios(
                    `https://assignments.reaktor.com/birdnest/pilots/${observation.serialNumber}`,
                    axiosConf
                );

                if (apiResponse.status === 404) {
                    //Pilot API not supplying pilot info, creating dummy pilot
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
                } else {
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
                } else {
                    await uploadOrUpdatePilot(pilot);
                }
            }

            // Next we prepare the data to be sent to the client

            // Fetching all pilots that have been seen in the last TIME_LIMIT seconds
            const pilots = await prisma.pilot.findMany({
                where:{
                    lastSeen: {
                        gt: new Date(Date.now() - 1000 * parseInt(process.env.TIME_LIMIT!))
                    }
                }
            });

            // Removing identifying information, i.e. serialNumber, from the observations before sending them to the client
            const sanitizedObservations: SanitizedObservation[] = observations.map((observation) => {
                return {
                    timestamp: observation.timestamp,
                    positionX: observation.positionX,
                    positionY: observation.positionY,
                };
            });

            resolve([sanitizedObservations, pilots]);
        } catch (err) {
            console.error(err);
            reject("Controller error");
        }
    });
}

export default controller;
