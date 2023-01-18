type Pilot = {
    serialNumber: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    closestDistance: number;
    lastSeen: string;
    lastViolation: string;
};

type Observation = {
    timestamp: string;
    positionY: number;
    positionX: number;
};

export { Pilot, Observation};
