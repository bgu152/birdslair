import { PrismaClient } from "@prisma/client";
import { Pilot } from "@prisma/client";

const prisma = new PrismaClient();
//Uploading or updating the pilot data to mariaDB
function uploadOrUpdatePilot(pilot: Pilot): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            await prisma.pilot.upsert({
                where: {
                    serialNumber: pilot.serialNumber,
                },
                update: {
                    lastSeen: pilot.lastSeen,
                    lastViolation: pilot.lastViolation,
                    closestDistance: pilot.closestDistance,
                },
                create: pilot,
            });

            resolve();
        } catch (err) {
            console.error(err);
            reject("uploadOrUpdatePilot error");
        }
    });
}


export default uploadOrUpdatePilot;