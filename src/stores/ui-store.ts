import { create } from 'zustand';

export type ProductionTab = 'latex' | 'ammonia' | 'rubber';
export type CropProductionTab = 'banana' | 'coconut' | 'manioc';
export type EmployeesTab = 'attendance' | 'payment';
export type FinancialsTab = 'sales' | 'expenses' | 'stats';
export type AssetsTab = 'cash' | 'debt' | 'assets' | 'stats';

interface UiState {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    setSidebarOpen: (isOpen: boolean) => void;
    productionTab: ProductionTab;
    setProductionTab: (tab: ProductionTab) => void;
    cropProductionTab: CropProductionTab;
    setCropProductionTab: (tab: CropProductionTab) => void;
    employeesTab: EmployeesTab;
    setEmployeesTab: (tab: EmployeesTab) => void;
    financialsTab: FinancialsTab;
    setFinancialsTab: (tab: FinancialsTab) => void;
    assetsTab: AssetsTab;
    setAssetsTab: (tab: AssetsTab) => void;
}

export const useUiStore = create<UiState>((set) => ({
    isSidebarOpen: true,
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
    productionTab: 'latex',
    setProductionTab: (tab) => set({ productionTab: tab }),
    cropProductionTab: 'banana',
    setCropProductionTab: (tab) => set({ cropProductionTab: tab }),
    employeesTab: 'attendance',
    setEmployeesTab: (tab) => set({ employeesTab: tab }),
    financialsTab: 'sales',
    setFinancialsTab: (tab) => set({ financialsTab: tab }),
    assetsTab: 'cash',
    setAssetsTab: (tab) => set({ assetsTab: tab }),
}));
