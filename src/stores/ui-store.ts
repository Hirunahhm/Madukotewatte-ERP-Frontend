import { create } from 'zustand';

export type ProductionTab = 'latex' | 'ammonia' | 'rubber';

interface UiState {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    setSidebarOpen: (isOpen: boolean) => void;
    productionTab: ProductionTab;
    setProductionTab: (tab: ProductionTab) => void;
}

export const useUiStore = create<UiState>((set) => ({
    isSidebarOpen: true,
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
    productionTab: 'latex',
    setProductionTab: (tab) => set({ productionTab: tab }),
}));
