type Pilot = {
    serialNumber: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    closestDistance: number;
    lastSeen: Date;
    lastViolation: Date;
};

type Observation = {
    id: string;
    timestamp: Date;
    positionY: number;
    positionX: number;
};

export { Pilot, Observation};
