import xmlToJs from "./xmlTojs";
import axios from "axios";
import { Observation } from "../types";

// Get the drone observations from the drone API
async function getObservations(): Promise<Observation[]> {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios("https://assignments.reaktor.com/birdnest/drones");
            const xmlData = await response.data;
            const data = xmlToJs(xmlData);

            let timestamp = data.report.capture.$.snapshotTimestamp;
            let date = new Date(timestamp);

            let arr = data.report.capture.drone;

            let observations: Observation[] = arr.map((observation: any) => {
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
        } catch (err) {
            console.error(err);
            reject("getObservationsData error");
        }
    });
}

export default getObservations;
