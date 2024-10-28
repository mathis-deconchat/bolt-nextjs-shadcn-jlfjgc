"use client"

import { Database } from '@/types/supabase'
import { createBrowserClient } from '@supabase/ssr'
import { SupabaseClient } from '@supabase/supabase-js'
import { useMemo } from 'react'

export type TypedSupabaseClient = SupabaseClient<Database, "vye">

export function getSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  return createBrowserClient<Database, "vye">(
    supabaseUrl,
    supabaseAnonKey,
    {
      db: {
        schema: "vye",
      },
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    }
  )
}

function useSupabaseClient() {
  return useMemo(getSupabaseBrowserClient, [])
}

export default useSupabaseClient