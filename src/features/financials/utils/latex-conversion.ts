export function metrolacToMassFactor(reading: number): number {
    return 0.1 + 0.002 * reading;
}
