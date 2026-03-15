import { EmployeeHeader } from "@/features/employees/components/employee-header";
import { TopPerformers } from "@/features/employees/components/top-performers";
import { ProductivityChart } from "@/features/employees/components/productivity-chart";
import { EmployeeTable } from "@/features/employees/components/employee-table";

export default function EmployeesPage() {
    return (
        <div className="space-y-6">
            <EmployeeHeader />
            <TopPerformers />
            <ProductivityChart />
            <EmployeeTable />
        </div>
    );
}
