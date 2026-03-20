import { create } from 'zustand';

export type ProductionTab = 'latex' | 'ammonia' | 'rubber';
export type EmployeesTab = 'attendance' | 'payment';
export type FinancialsTab = 'sales' | 'expenses' | 'stats';

interface UiState {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    setSidebarOpen: (isOpen: boolean) => void;
    productionTab: ProductionTab;
    setProductionTab: (tab: ProductionTab) => void;
    employeesTab: EmployeesTab;
    setEmployeesTab: (tab: EmployeesTab) => void;
    financialsTab: FinancialsTab;
    setFinancialsTab: (tab: FinancialsTab) => void;
}

export const useUiStore = create<UiState>((set) => ({
    isSidebarOpen: true,
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
    productionTab: 'latex',
    setProductionTab: (tab) => set({ productionTab: tab }),
    employeesTab: 'attendance',
    setEmployeesTab: (tab) => set({ employeesTab: tab }),
    financialsTab: 'sales',
    setFinancialsTab: (tab) => set({ financialsTab: tab }),
}));
