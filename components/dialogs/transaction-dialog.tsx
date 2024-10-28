"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TransactionList } from "./transaction-list"
import { TransactionChart } from "./transaction-chart"
import { format } from "date-fns"

interface TransactionDialogProps {
  type: "income" | "expenses" | null
  onClose: () => void
}

export function TransactionDialog({ type, onClose }: TransactionDialogProps) {
  if (!type) return null

  const currentMonth = format(new Date(), "MMMM yyyy")

  return (
    <Dialog open={!!type} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85vh] w-[95vw] max-w-5xl p-0">
        <div className="flex h-full max-h-[85vh] flex-col">
          <DialogHeader className="px-4 py-3 sm:px-6 sm:py-4 border-b">
            <DialogTitle className="text-lg sm:text-xl font-semibold">
              {type === "income" ? "Income" : "Expenses"} Analysis
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Detailed breakdown for {currentMonth}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="list" className="flex-1 flex flex-col min-h-0">
            <div className="px-4 py-2 sm:px-6 border-b bg-muted/40">
              <TabsList className="grid w-full max-w-xs grid-cols-2">
                <TabsTrigger value="list">Transactions</TabsTrigger>
                <TabsTrigger value="chart">Analytics</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 min-h-0">
              <TabsContent value="list" className="h-full m-0">
                <ScrollArea className="h-full">
                  <div className="p-4 sm:p-6">
                    <TransactionList type={type} />
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="chart" className="h-full m-0">
                <ScrollArea className="h-full">
                  <div className="p-4 sm:p-6">
                    <TransactionChart type={type} />
                  </div>
                </ScrollArea>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}