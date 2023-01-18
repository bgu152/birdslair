import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//Remove pilot data older than ten minutes from database
const removeData = async (): Promise<void> => {
    // Remove observations older than 10 minutes
    return new Promise(async (resolve, reject) => {
        try {
            await prisma.pilot.deleteMany({
                where: {
                    lastSeen: {
                        lt: new Date(Date.now() - 1000 * parseInt(process.env.TIME_LIMIT!)),
                    },
                },
            });
            resolve();
        } catch (err) {
            console.error(err);
            reject("removeOldObservations error");
        }
    });
};

export default removeData;
