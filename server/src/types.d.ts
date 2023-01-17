import { StringLiteralType } from "typescript";


type Observation = {
    serialNumber: string;
    timestamp: Date;
    positionY: number;
    positionX: number;
};

export { Observation };
