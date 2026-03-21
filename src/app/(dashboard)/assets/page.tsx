import { AssetsHeader } from "@/features/assets/components/assets-header";
import { AssetsPageClient } from "@/features/assets/components/assets-page-client";

export default function AssetsPage() {
    return (
        <div className="space-y-6">
            <AssetsHeader />
            <AssetsPageClient />
        </div>
    );
}
