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
import { Textarea } from "@/components/ui/textarea";
import { mealSchema, MealSchema } from "@/lib/validations/meal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { useState } from "react";
import { createMeal, updateMeal } from "@/app/actions/meals";
import { format } from "date-fns";

const familyMembers = [
  { id: "parent-1", name: "Papá" },
  { id: "parent-2", name: "Mamá" },
  { id: "child-1", name: "Hijo 1" },
  { id: "child-2", name: "Hijo 2" },
  { id: "child-3", name: "Hijo 3" },
  { id: "child-4", name: "Hijo 4" },
  { id: "child-5", name: "Hijo 5" },
];

const mealTypes = [
  { value: "breakfast", label: "Desayuno" },
  { value: "lunch", label: "Almuerzo" },
  { value: "dinner", label: "Cena" },
  { value: "snack", label: "Merienda" },
];

interface MealDialogProps {
  trigger?: React.ReactNode;
  mealToEdit?: MealSchema & { id: string };
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultDate?: Date;
  defaultType?: "breakfast" | "lunch" | "dinner" | "snack";
}

export function MealDialog({
  trigger,
  mealToEdit,
  open,
  onOpenChange,
  defaultDate,
  defaultType,
}: MealDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  const form = useForm<MealSchema>({
    resolver: zodResolver(mealSchema) as unknown as Resolver<MealSchema>,
    defaultValues: {
      date: mealToEdit?.date || defaultDate || new Date(),
      type: mealToEdit?.type || defaultType || "lunch",
      description: mealToEdit?.description || "",
      assignedTo: mealToEdit?.assignedTo || "",
    },
  });

  async function onSubmit(data: MealSchema) {
    try {
      if (mealToEdit) {
        await updateMeal(mealToEdit.id, data);
        toast.success("Comida actualizada");
      } else {
        await createMeal(data);
        toast.success("Comida creada");
      }
      
      setIsOpen(false);
      form.reset();
    } catch (error) {
      toast.error("Error al guardar la comida");
      console.error(error);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nueva Comida
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mealToEdit ? "Editar Comida" : "Nueva Comida"}</DialogTitle>
          <DialogDescription>
            {mealToEdit
              ? "Modifica los detalles del menú."
              : "Añade una comida al plan semanal."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                        onChange={(e) => field.onChange(new Date(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mealTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Menú / Descripción</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ej. Pollo con arroz y ensalada" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="assignedTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cocinero (Opcional)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar miembro" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {familyMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Guardar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
