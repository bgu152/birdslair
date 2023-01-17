import { Sighting } from '../types';

export default function distance(sighting: Sighting): number {
    const x = sighting.positionX / 1000 - 250;
    const y = sighting.positionY / 1000 - 250;
    const d = Math.sqrt(x * x + y * y);
    return d;
}