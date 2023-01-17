import axios, { AxiosRequestConfig } from "axios";
import { PrismaClient } from "@prisma/client";
import { Pilot } from "@prisma/client";
import { Observation } from "../types";
import getObservations from "./getObservations";
import uploadOrUpdatePilot from "./uploadOrUpdatePilot";

const prisma = new PrismaClient();

// Axios config, allows 404 status codes. Needed because pilot data is not available for all drones
let axiosConf: AxiosRequestConfig = {};
axiosConf.validateStatus = (status: number) => {
    return (status >= 200 && status < 300) || status == 404;
};

//Distance between the birdsnest and a drone
function distance(observation: Observation): number {
    const x = observation.positionX / 1000 - 250;
    const y = observation.positionY / 1000 - 250;
    const d = Math.sqrt(x * x + y * y);
    return d;
}

// Uploads pilot data to mariaDB, returns promise with pilot data and latest drone coordinates
async function Controller(): Promise<[Observation[], Pilot[]]> {
    return new Promise(async (resolve, reject) => {
        try {
            const observations = await getObservations();
            console.log("Observations fetched");

            for (let observation of observations) {
                const distanceToNest = distance(observation);

                // look for pilot in database
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
                    // The pilot exists in the database, therefore a recent offender and is updated in the database
                    pilot.lastSeen = observation.timestamp;
                    if (distanceToNest < 100) {
                        pilot.lastViolation = observation.timestamp;
                        pilot.closestDistance = Math.min(distanceToNest, pilot.closestDistance);
                    }
                    await uploadOrUpdatePilot(pilot);
                    continue;
                }

                // If we get here, the pilot does not exist in the database and is in violation of the 100m rule

                // Fetching pilot data from the pilot API
                const apiResponse = await axios(
                    `https://assignments.reaktor.com/birdnest/pilots/${observation.serialNumber}`,
                    axiosConf
                );

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

            const pilots = await prisma.pilot.findMany();

            resolve([observations, pilots]);
        } catch (err) {
            console.error(err);
            reject("Controller error");
        }
    });
}

export default Controller;
