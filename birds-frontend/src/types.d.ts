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

type Sighting = {
    id: string;
    serialNumber: string;
    timestamp: Date;
    positionY: number;
    positionX: number;
};

export { Pilot, Sighting};
