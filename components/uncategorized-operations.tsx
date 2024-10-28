"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import useSupabaseClient from "@/lib/supabase-client"
import { format } from "date-fns"
import { Loader2, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Database } from "@/types/supabase"
import { toast } from "sonner"

type Operation = Database["vye"]["Tables"]["cozy_bank_operations"]["Row"]
type Category = Database["vye"]["Tables"]["cozy_operation_categories"]["Row"]

export function UncategorizedOperations() {
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const queryClient = useQueryClient()
  const supabase = useSupabaseClient()

  const { data: operations, isLoading: isLoadingOperations } = useQuery<Operation[]>({
    queryKey: ["uncategorized-operations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cozy_bank_operations")
        .select()
        .eq("cozy_automatic_category_id", 0)
        .not("cozy_amount", "is", null)
        .order("cozy_realisation_date", { ascending: false })
        .limit(50)

      if (error) throw error
      return data
    },
  })

  const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[]>({
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

  const categorizeOperation = useMutation({
    mutationFn: async ({ operationId, categoryId }: { operationId: number, categoryId: string }) => {
      const { error } = await supabase
        .from("cozy_bank_operations")
        .update({ cozy_category_id: categoryId })
        .eq("id", operationId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["uncategorized-operations"] })
      setIsDialogOpen(false)
      toast.success("Operation categorized successfully")
    },
    onError: () => {
      toast.error("Failed to categorize operation")
    },
  })

  if (isLoadingOperations || isLoadingCategories) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Uncategorized Operations</h2>
        <div className="text-sm text-muted-foreground">
          {operations?.length} operations need categorization
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Label</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {operations?.map((operation) => (
              <TableRow key={operation.id}>
                <TableCell>
                  {operation.cozy_realisation_date
                    ? format(new Date(operation.cozy_realisation_date), "MMM dd, yyyy")
                    : "No date"}
                </TableCell>
                <TableCell>{operation.cozy_label || "Unknown"}</TableCell>
                <TableCell className="font-medium">
                  €{(operation.cozy_amount || 0).toFixed(2)}
                </TableCell>
                <TableCell>
                  <Dialog open={isDialogOpen && selectedOperation?.id === operation.id} 
                         onOpenChange={(open) => {
                           setIsDialogOpen(open)
                           if (!open) setSelectedOperation(null)
                         }}>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedOperation(operation)}
                      >
                        <Tag className="h-4 w-4 mr-2" />
                        Categorize
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Categorize Operation</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <h4 className="font-medium">Operation Details</h4>
                          <p className="text-sm text-muted-foreground">
                            {operation.cozy_label}
                          </p>
                          <p className="text-sm font-medium">
                            €{(operation.cozy_amount || 0).toFixed(2)}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Select Category
                          </label>
                          <Select
                            onValueChange={(value) => {
                              if (selectedOperation) {
                                categorizeOperation.mutate({
                                  operationId: selectedOperation.id,
                                  categoryId: value,
                                })
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories?.map((category) => (
                                <SelectItem
                                  key={category.code}
                                  value={category.code || ""}
                                >
                                  {category.fr_traduction || category.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}