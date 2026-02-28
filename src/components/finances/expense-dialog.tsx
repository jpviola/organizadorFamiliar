"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { expenseSchema, ExpenseSchema } from "@/lib/validations/expense";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { createExpense, updateExpense } from "@/app/actions/expenses";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

const CATEGORIES = [
  { value: "groceries", label: "Supermercado" },
  { value: "utilities", label: "Servicios" },
  { value: "education", label: "Educación" },
  { value: "transport", label: "Transporte" },
  { value: "entertainment", label: "Entretenimiento" },
  { value: "health", label: "Salud" },
  { value: "clothing", label: "Ropa" },
  { value: "other", label: "Otros" },
];

interface ExpenseDialogProps {
  expenseToEdit?: ExpenseSchema & { id: string };
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ExpenseDialog({ expenseToEdit, trigger, open: controlledOpen, onOpenChange: setControlledOpen }: ExpenseDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? setControlledOpen : setInternalOpen;

  const isEditing = !!expenseToEdit;

  const form = useForm<ExpenseSchema>({
    resolver: zodResolver(expenseSchema) as unknown as Resolver<ExpenseSchema>,
    defaultValues: {
      amount: expenseToEdit?.amount || 0,
      category: expenseToEdit?.category || "groceries",
      description: expenseToEdit?.description || "",
      date: expenseToEdit?.date || new Date(),
    },
  });

  // Reset form when dialog opens/closes or expenseToEdit changes
  useEffect(() => {
    if (open) {
      form.reset({
        amount: expenseToEdit?.amount || 0,
        category: expenseToEdit?.category || "groceries",
        description: expenseToEdit?.description || "",
        date: expenseToEdit?.date || new Date(),
      });
    }
  }, [open, expenseToEdit, form]);

  async function onSubmit(data: ExpenseSchema) {
    try {
      if (isEditing) {
        const result = await updateExpense(expenseToEdit.id, data);
        if (result.success) {
          toast.success("Gasto actualizado correctamente");
          setOpen?.(false);
        } else {
          toast.error("Error al actualizar gasto");
        }
      } else {
        const result = await createExpense(data);
        if (result.success) {
          toast.success("Gasto creado correctamente");
          setOpen?.(false);
          form.reset();
        } else {
          toast.error("Error al crear gasto");
        }
      }
    } catch {
      toast.error("Ocurrió un error inesperado");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Gasto" : "Nuevo Gasto"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica los detalles del gasto."
              : "Agrega un nuevo gasto al registro familiar."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Compra semanal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monto</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        placeholder="0.00" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: es })
                          ) : (
                            <span>Seleccionar fecha</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">
                {isEditing ? "Guardar cambios" : "Crear gasto"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
