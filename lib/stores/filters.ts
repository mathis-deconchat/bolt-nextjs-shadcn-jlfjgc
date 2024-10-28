"use client"

import { create } from "zustand"

interface FiltersState {
  dateRange: [Date | null, Date | null]
  selectedAccounts: string[]
  setDateRange: (range: [Date | null, Date | null]) => void
  setSelectedAccounts: (accounts: string[]) => void
}

export const useFilters = create<FiltersState>((set) => ({
  dateRange: [null, null],
  selectedAccounts: [],
  setDateRange: (range) => set({ dateRange: range }),
  setSelectedAccounts: (accounts) => set({ selectedAccounts: accounts }),
}))