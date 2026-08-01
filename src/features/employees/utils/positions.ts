export const TAPPER_POSITIONS = ["Tapper", "Lead Tapper", "Senior Tapper", "Junior Tapper"] as const;
export const SALARIED_POSITIONS = [
    "General Labour",
    "Assistant Manager",
    "Supervisor",
    "Operations Assistant",
    "Manager",
    "General Manager",
] as const;
export const POSITIONS = [...TAPPER_POSITIONS, ...SALARIED_POSITIONS];

export function isTapperPosition(position: string | null | undefined): boolean {
    return (TAPPER_POSITIONS as readonly string[]).includes(position ?? "");
}
