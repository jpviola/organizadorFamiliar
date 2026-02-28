import { Metadata } from "next";
import { getExpenses } from "@/app/actions/expenses";
import { columns } from "@/components/finances/columns";
import { DataTable } from "@/components/ui/data-table";
import { ExpenseDialog } from "@/components/finances/expense-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, CreditCard } from "lucide-react";
import { startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

export const metadata: Metadata = {
  title: "Finanzas | Organizador Familiar",
  description: "Control de gastos y presupuesto familiar",
};

export default async function FinancesPage() {
  const expenses = await getExpenses();

  // Calculate summary metrics
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  
  const now = new Date();
  const currentMonthExpenses = expenses
    .filter(e => isWithinInterval(e.date, { start: startOfMonth(now), end: endOfMonth(now) }))
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Group by category to find top category
  const expensesByCategory: Record<string, number> = {};
  expenses.forEach(e => {
    expensesByCategory[e.category] = (expensesByCategory[e.category] || 0) + e.amount;
  });
  
  const topCategoryEntry = Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1])[0];
  const topCategory = topCategoryEntry ? topCategoryEntry[0] : "N/A";
  
  const CATEGORIES: Record<string, string> = {
    groceries: "Supermercado",
    utilities: "Servicios",
    education: "Educación",
    transport: "Transporte",
    entertainment: "Entretenimiento",
    health: "Salud",
    clothing: "Ropa",
    other: "Otros",
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  return (
    <div className="flex h-full flex-1 flex-col space-y-8 p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Finanzas</h2>
          <p className="text-muted-foreground">
            Control de gastos y presupuesto familiar.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <ExpenseDialog />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Gasto Total (Histórico)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">
              Total acumulado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Mes Actual
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(currentMonthExpenses)}</div>
            <p className="text-xs text-muted-foreground">
              Gastos de este mes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Mayor Categoría
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {CATEGORIES[topCategory] || topCategory}
            </div>
            <p className="text-xs text-muted-foreground">
              {topCategoryEntry ? formatCurrency(topCategoryEntry[1]) : "$0.00"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <DataTable columns={columns} data={expenses} filterColumn="description" />
      </div>
    </div>
  );
}
