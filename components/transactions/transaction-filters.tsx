"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import useSupabaseClient from "@/lib/supabase-client"
import { Filter } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function TransactionFilters() {
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const supabase = useSupabaseClient()

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cozy_operation_categories")
        .select()
        .order("fr_traduction")

      if (error) throw error
      return data
    },
  })

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Filters:</span>
      </div>

      <Select
        value={selectedCategory}
        onValueChange={setSelectedCategory}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Categories</SelectLabel>
            <SelectItem value="">All Categories</SelectItem>
            {categories?.map((category) => (
              <SelectItem 
                key={category.code} 
                value={category.code || ""}
              >
                {category.fr_traduction}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {selectedCategory && (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setSelectedCategory("")}
          className="h-8 px-2 text-xs"
        >
          Clear filters
        </Button>
      )}

      {selectedCategory && (
        <div className="flex gap-2 ml-2">
          <Badge variant="secondary" className="rounded-sm">
            {categories?.find(c => c.code === selectedCategory)?.fr_traduction}
          </Badge>
        </div>
      )}
    </div>
  )
}