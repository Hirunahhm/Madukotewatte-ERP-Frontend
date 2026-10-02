import type { PageResponse } from "@/features/production/types/production.types";

export type { PageResponse };

export type HarvestUnit = "kg" | "g" | "nuts" | "bunches" | "litres" | "units" | "cubic_ft" | "other";

export interface CropHarvest {
    id: string;
    crop: string;
    harvestDate: string;      // "YYYY-MM-DD"
    quantity: number;
    unit: HarvestUnit;
    fieldBlock: string | null;
    employeeId: string | null;
    employeeName: string | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CropHarvestRequest {
    crop: string;
    harvestDate: string;
    quantity: number;
    unit: string;
    fieldBlock?: string;
    employeeId?: string;
    notes?: string;
}

export interface CropHarvestSummaryRow {
    crop: string;
    month: string;            // "YYYY-MM"
    unit: string;
    quantity: number;
    harvests: number;
}

export interface CropHarvestOptions {
    crops: string[];
    units: string[];
}
