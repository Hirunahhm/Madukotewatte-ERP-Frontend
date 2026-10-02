"use client";

import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { useCreateCropHarvest } from "@/features/production/hooks/use-crop-harvests";
import { HarvestForm } from "./harvest-form";

export function HarvestEntry() {
    const create = useCreateCropHarvest();
    const [error, setError] = useState<string | null>(null);
    const [formKey, setFormKey] = useState(0);

    return (
        <Card className="shadow-sm gap-0 p-6">
            <CardTitle className="text-base font-semibold mb-5">Record Harvest</CardTitle>
            <HarvestForm
                key={formKey}
                submitLabel="Record Harvest"
                isSubmitting={create.isPending}
                error={error}
                onSubmit={async (payload) => {
                    setError(null);
                    try {
                        await create.mutateAsync(payload);
                        setFormKey((k) => k + 1);
                    } catch (err) {
                        setError(err instanceof Error ? err.message : "Failed to record the harvest.");
                    }
                }}
            />
        </Card>
    );
}
