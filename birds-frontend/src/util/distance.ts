import { Observation } from '../types';

export default function distance(observation: Observation): number {
    const x = observation.positionX / 1000 - 250;
    const y = observation.positionY / 1000 - 250;
    const d = Math.sqrt(x * x + y * y);
    return d;
}