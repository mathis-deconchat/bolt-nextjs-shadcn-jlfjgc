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
import { DialogTransactionList } from "@/components/dialog-transaction-list"
import { TransactionChart } from "@/components/transaction-chart"
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
      <DialogContent className="max-w-[900px] w-[90vw] h-[80vh] p-0">
        <div className="flex flex-col h-full">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="text-xl font-semibold tracking-tight">
              {type === "income" ? "Income" : "Expenses"} Analysis
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-1">
              Detailed breakdown of your {type} for {currentMonth}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="list" className="flex-1 flex flex-col min-h-0">
            <div className="px-6 py-2 border-b bg-muted/40">
              <TabsList className="w-full max-w-[400px] h-9">
                <TabsTrigger value="list" className="flex-1">
                  List View
                </TabsTrigger>
                <TabsTrigger value="chart" className="flex-1">
                  Chart View
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 min-h-0">
              <TabsContent value="list" className="h-full mt-0 p-0">
                <ScrollArea className="h-full">
                  <div className="p-6">
                    <DialogTransactionList type={type} />
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="chart" className="h-full mt-0 p-0">
                <ScrollArea className="h-full">
                  <div className="p-6">
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