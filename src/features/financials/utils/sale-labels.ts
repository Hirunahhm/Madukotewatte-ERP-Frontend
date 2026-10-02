const CORE_LABELS: Record<string, string> = {
    "latex": "Latex",
    "rubber-solid": "Rubber Solid",
    "manioc": "Manioc",
    "coconut": "Coconut",
    "banana": "Banana",
};

/** Core categories are lowercase ids; general sales already carry their product name ("Cocoa"). */
export function saleCategoryLabel(category: string): string {
    return CORE_LABELS[category] ?? category;
}

export function formatLkr(value: number): string {
    return `LKR ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}
