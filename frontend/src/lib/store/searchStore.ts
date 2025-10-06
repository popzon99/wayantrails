import { create } from 'zustand';

interface SearchFilters {
  category: 'all' | 'resorts' | 'homestays' | 'rentals' | 'destinations' | 'services';
  location?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  priceMin?: number;
  priceMax?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'popular' | 'newest';
}

interface SearchState {
  // Search query
  query: string;

  // Active filters
  filters: SearchFilters;

  // Recent searches
  recentSearches: string[];

  // Actions
  setQuery: (query: string) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
  addRecentSearch: (search: string) => void;
  clearRecentSearches: () => void;
}

const defaultFilters: SearchFilters = {
  category: 'all',
  location: undefined,
  checkIn: undefined,
  checkOut: undefined,
  guests: 2,
  priceMin: undefined,
  priceMax: undefined,
  sortBy: 'popular',
};

export const useSearchStore = create<SearchState>((set, get) => ({
  query: '',
  filters: defaultFilters,
  recentSearches: [],

  setQuery: (query) => {
    set({ query });
    if (query.trim() && !get().recentSearches.includes(query.trim())) {
      get().addRecentSearch(query.trim());
    }
  },

  setFilters: (newFilters) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...newFilters,
      },
    })),

  resetFilters: () => set({ filters: defaultFilters }),

  addRecentSearch: (search) =>
    set((state) => ({
      recentSearches: [
        search,
        ...state.recentSearches.filter((s) => s !== search),
      ].slice(0, 10), // Keep only last 10 searches
    })),

  clearRecentSearches: () => set({ recentSearches: [] }),
}));
