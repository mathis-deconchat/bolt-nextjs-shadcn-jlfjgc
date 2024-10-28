"use client"

import { useQuery } from "@tanstack/react-query"
import useSupabaseClient from "@/lib/supabase-client"
import { Database } from "@/types/supabase"

type Operation = Database["vye"]["Tables"]["cozy_bank_operations"]["Row"] & {
  cozy_bank_accounts?: Database["vye"]["Tables"]["cozy_bank_accounts"]["Row"] | null
  cozy_operation_categories?: Database["vye"]["Tables"]["cozy_operation_categories"]["Row"] | null
}

export function useOperations() {
  const supabase = useSupabaseClient()

  return useQuery<Operation[]>({
    queryKey: ["operations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cozy_bank_operations")
        .select(`
          *,
          cozy_bank_accounts!cozy_bank_operations_cozy_account_id_fkey (*),
          cozy_operation_categories!cozy_bank_operations_cozy_category_id_fkey (*)
        `)
        .order("cozy_realisation_date", { ascending: false })
        .limit(100)

      if (error) {
        console.error("Error fetching operations:", error)
        throw error
      }

      return data
    },
  })
}