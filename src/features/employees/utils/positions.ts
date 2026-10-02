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

/** The pay type a new employee of this position normally has (the form still lets the owner change it). */
export function defaultPayTypeForPosition(position: string | null | undefined): "FIXED_MONTHLY" | "PER_TREE" {
    return isTapperPosition(position) ? "PER_TREE" : "FIXED_MONTHLY";
}
