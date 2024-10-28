"use client"

import { useQuery } from "@tanstack/react-query"
import { useFilters } from "@/lib/stores/filters"
import useSupabaseClient from "@/lib/supabase-client"
import { format } from "date-fns"
import { Database } from "@/types/supabase"

type Operation = Database["vye"]["Tables"]["cozy_bank_operations"]["Row"]

export function useFilteredOperations() {
  const supabase = useSupabaseClient()
  const { dateRange, selectedAccounts } = useFilters()
  const [startDate, endDate] = dateRange

  return useQuery<Operation[]>({
    queryKey: ["filtered-operations", { startDate, endDate, selectedAccounts }],
    queryFn: async () => {
      let query = supabase
        .from("cozy_bank_operations")
        .select(`
          *,
          cozy_bank_accounts!cozy_bank_operations_cozy_account_id_fkey (*),
          cozy_operation_categories!cozy_bank_operations_cozy_category_id_fkey (*)
        `)
        .order("cozy_realisation_date", { ascending: false })

      if (startDate) {
        query = query.gte("cozy_realisation_date", format(startDate, "yyyy-MM-dd"))
      }
      if (endDate) {
        query = query.lte("cozy_realisation_date", format(endDate, "yyyy-MM-dd"))
      }
      if (selectedAccounts.length > 0) {
        query = query.in("cozy_account_id", selectedAccounts)
      }

      const { data, error } = await query

      if (error) throw error
      return data
    },
    // Enable automatic refetching when filters change
    refetchOnWindowFocus: false,
  })
}