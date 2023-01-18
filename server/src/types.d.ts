type Observation = {
    serialNumber: string;
    timestamp: Date;
    positionY: number;
    positionX: number;
};

// This is the type of data that will be sent to the client
type SanitizedObservation = {
    timestamp: Date;
    positionY: number;
    positionX: number;
};

export { Observation, SanitizedObservation };
