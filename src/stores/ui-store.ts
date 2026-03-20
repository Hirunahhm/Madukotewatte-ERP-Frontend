import { create } from 'zustand';

export type ProductionTab = 'latex' | 'ammonia' | 'rubber';
export type EmployeesTab = 'attendance' | 'payment';

interface UiState {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    setSidebarOpen: (isOpen: boolean) => void;
    productionTab: ProductionTab;
    setProductionTab: (tab: ProductionTab) => void;
    employeesTab: EmployeesTab;
    setEmployeesTab: (tab: EmployeesTab) => void;
}

export const useUiStore = create<UiState>((set) => ({
    isSidebarOpen: true,
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
    productionTab: 'latex',
    setProductionTab: (tab) => set({ productionTab: tab }),
    employeesTab: 'attendance',
    setEmployeesTab: (tab) => set({ employeesTab: tab }),
}));
