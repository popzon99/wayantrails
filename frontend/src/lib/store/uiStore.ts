import { create } from 'zustand';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface UIState {
  // Mobile menu
  isMobileMenuOpen: boolean;

  // Filter sidebar
  isFilterOpen: boolean;

  // Modals
  activeModal: string | null;
  modalData: any;

  // Toasts
  toasts: Toast[];

  // Loading overlay
  isGlobalLoading: boolean;

  // Actions
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (isOpen: boolean) => void;

  toggleFilter: () => void;
  setFilterOpen: (isOpen: boolean) => void;

  openModal: (modalId: string, data?: any) => void;
  closeModal: () => void;

  showToast: (message: string, type?: Toast['type'], duration?: number) => void;
  removeToast: (id: string) => void;

  setGlobalLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  isMobileMenuOpen: false,
  isFilterOpen: false,
  activeModal: null,
  modalData: null,
  toasts: [],
  isGlobalLoading: false,

  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

  setMobileMenuOpen: (isOpen) => set({ isMobileMenuOpen: isOpen }),

  toggleFilter: () =>
    set((state) => ({ isFilterOpen: !state.isFilterOpen })),

  setFilterOpen: (isOpen) => set({ isFilterOpen: isOpen }),

  openModal: (modalId, data = null) =>
    set({ activeModal: modalId, modalData: data }),

  closeModal: () => set({ activeModal: null, modalData: null }),

  showToast: (message, type = 'info', duration = 5000) => {
    const id = Math.random().toString(36).substring(7);
    const toast: Toast = { id, message, type, duration };

    set((state) => ({
      toasts: [...state.toasts, toast],
    }));

    // Auto-remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    }
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),

  setGlobalLoading: (loading) => set({ isGlobalLoading: loading }),
}));
