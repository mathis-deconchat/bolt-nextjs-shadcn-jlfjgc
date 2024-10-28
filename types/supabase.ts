export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  vye: {
    Tables: {
      cozy_balance_histories: {
        Row: {
          balance: number
          cozy_account_id: string | null
          created_at: string | null
          day: string
          id: number
          updated_at: string | null
        }
        Insert: {
          balance: number
          cozy_account_id?: string | null
          created_at?: string | null
          day: string
          id?: number
          updated_at?: string | null
        }
        Update: {
          balance?: number
          cozy_account_id?: string | null
          created_at?: string | null
          day?: string
          id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cozy_balance_histories_cozy_account_id_fkey"
            columns: ["cozy_account_id"]
            isOneToOne: false
            referencedRelation: "cozy_bank_accounts"
            referencedColumns: ["cozy_doc_id"]
          }
        ]
      }
      cozy_bank_accounts: {
        Row: {
          cozy_account_type: string
          cozy_balance: string | null
          cozy_doc_id: string
          cozy_doc_rev: string | null
          cozy_iban: string | null
          cozy_institution_label: string | null
          cozy_label: string
          cozy_metadata: Json | null
          cozy_number: string | null
          cozy_vendor_id: string | null
          created_at: string | null
          icon: string | null
          id: number
          label: string | null
          slug: string | null
          updated_at: string | null
        }
        Insert: {
          cozy_account_type: string
          cozy_balance?: string | null
          cozy_doc_id: string
          cozy_doc_rev?: string | null
          cozy_iban?: string | null
          cozy_institution_label?: string | null
          cozy_label: string
          cozy_metadata?: Json | null
          cozy_number?: string | null
          cozy_vendor_id?: string | null
          created_at?: string | null
          icon?: string | null
          id?: number
          label?: string | null
          slug?: string | null
          updated_at?: string | null
        }
        Update: {
          cozy_account_type?: string
          cozy_balance?: string | null
          cozy_doc_id?: string
          cozy_doc_rev?: string | null
          cozy_iban?: string | null
          cozy_institution_label?: string | null
          cozy_label?: string
          cozy_metadata?: Json | null
          cozy_number?: string | null
          cozy_vendor_id?: string | null
          created_at?: string | null
          icon?: string | null
          id?: number
          label?: string | null
          slug?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      cozy_bank_operations: {
        Row: {
          cozy_account_id: string | null
          cozy_amount: number | null
          cozy_automatic_category_id: string | null
          cozy_category_id: string | null
          cozy_category_proba: number | null
          cozy_currency: string | null
          cozy_doc_id: string | null
          cozy_doc_rev: string | null
          cozy_is_active: boolean | null
          cozy_is_coming: boolean | null
          cozy_is_manual: boolean | null
          cozy_label: string | null
          cozy_metadata: Json | null
          cozy_original_bank_label: string | null
          cozy_raw_date: string | null
          cozy_realisation_date: string | null
          cozy_to_categorize: boolean | null
          cozy_vendor_account_id: string | null
          cozy_vendor_id: string | null
          created_at: string | null
          id: number
          is_created_by_vye: boolean | null
          parent_id: number | null
          updated_at: string | null
        }
        Insert: {
          cozy_account_id?: string | null
          cozy_amount?: number | null
          cozy_automatic_category_id?: string | null
          cozy_category_id?: string | null
          cozy_category_proba?: number | null
          cozy_currency?: string | null
          cozy_doc_id?: string | null
          cozy_doc_rev?: string | null
          cozy_is_active?: boolean | null
          cozy_is_coming?: boolean | null
          cozy_is_manual?: boolean | null
          cozy_label?: string | null
          cozy_metadata?: Json | null
          cozy_original_bank_label?: string | null
          cozy_raw_date?: string | null
          cozy_realisation_date?: string | null
          cozy_to_categorize?: boolean | null
          cozy_vendor_account_id?: string | null
          cozy_vendor_id?: string | null
          created_at?: string | null
          id?: number
          is_created_by_vye?: boolean | null
          parent_id?: number | null
          updated_at?: string | null
        }
        Update: {
          cozy_account_id?: string | null
          cozy_amount?: number | null
          cozy_automatic_category_id?: string | null
          cozy_category_id?: string | null
          cozy_category_proba?: number | null
          cozy_currency?: string | null
          cozy_doc_id?: string | null
          cozy_doc_rev?: string | null
          cozy_is_active?: boolean | null
          cozy_is_coming?: boolean | null
          cozy_is_manual?: boolean | null
          cozy_label?: string | null
          cozy_metadata?: Json | null
          cozy_original_bank_label?: string | null
          cozy_raw_date?: string | null
          cozy_realisation_date?: string | null
          cozy_to_categorize?: boolean | null
          cozy_vendor_account_id?: string | null
          cozy_vendor_id?: string | null
          created_at?: string | null
          id?: number
          is_created_by_vye?: boolean | null
          parent_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cozy_bank_operations_cozy_account_id_fkey"
            columns: ["cozy_account_id"]
            isOneToOne: false
            referencedRelation: "cozy_bank_accounts"
            referencedColumns: ["cozy_doc_id"]
          },
          {
            foreignKeyName: "cozy_bank_operations_cozy_automatic_category_id_fkey"
            columns: ["cozy_automatic_category_id"]
            isOneToOne: false
            referencedRelation: "cozy_operation_categories"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "cozy_bank_operations_cozy_category_id_fkey"
            columns: ["cozy_category_id"]
            isOneToOne: false
            referencedRelation: "cozy_operation_categories"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "cozy_bank_operations_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "cozy_bank_operations"
            referencedColumns: ["id"]
          }
        ]
      }
      cozy_operation_categories: {
        Row: {
          code: string | null
          fr_traduction: string | null
          id: number
          label: string | null
        }
        Insert: {
          code?: string | null
          fr_traduction?: string | null
          id?: number
          label?: string | null
        }
        Update: {
          code?: string | null
          fr_traduction?: string | null
          id?: number
          label?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      fetch_all_cozy_balance_histories: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      fetch_all_cozy_bank_accounts: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      fetch_cozy_bank_operations: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      fetch_new_cozy_bank_operations: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_average_balance: {
        Args: {
          p_cozy_account_id: string
          p_start_date: string
          p_end_date: string
        }
        Returns: {
          interval_type: string
          interval_start: string
          avg_balance: number
        }[]
      }
      get_balance_series: {
        Args: {
          start_date: string
        }
        Returns: {
          account_id: string
          account_label: string
          balance_date: string
          balance: number
        }[]
      }
    }
    Enums: {
      cozy_account_type:
        | "none"
        | "LongTermSavings"
        | "Business"
        | "Checkings"
        | "Loan"
        | "CreditCard"
      vye_budgets_span: "daily" | "weekly" | "monthly" | "yearly"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never