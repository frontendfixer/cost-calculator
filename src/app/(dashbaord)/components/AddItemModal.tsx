'use client';

import { Plus } from 'lucide-react';
import { type UseFormReturn, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Calendar } from '~/components/ui/calendar';
import { cn } from '~/lib/utils';
import toast from 'react-hot-toast';
import { Transactions } from '../actions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { StatusCodes } from 'http-status-codes';
import { useState } from 'react';
import Icon from '~/components/Icon';

export const AddItemSchema = z.object({
  transaction_type: z.enum(['credit', 'debit']),
  date: z.date(),
  amount: z.string().regex(/^[0-9]+$/, 'Amount must be a number'),
  category: z.enum(['food', 'grocery', 'entertainment', 'other']),
  payment_method: z.enum(['cash', 'online']),
  title: z.string().min(1, { message: 'Title is required' }),
});

export type TAddItemSchema = z.infer<typeof AddItemSchema>;
export default function AddItemModal() {
  const [open, setOpen] = useState(false);

  const form = useForm<TAddItemSchema>({
    resolver: zodResolver(AddItemSchema),
    defaultValues: {
      transaction_type: 'debit',
      date: new Date(),
      amount: '',
      category: 'other',
      payment_method: 'cash',
      title: '',
    },
  });

  const queryClient = useQueryClient();
  const SubmitMutation = useMutation({
    mutationKey: ['add-item'],
    mutationFn: async (data: TAddItemSchema) => await Transactions.add(data),
    onSuccess: async resp => {
      if (resp.status === StatusCodes.OK) {
        toast.success(resp.message);
        form.reset();
        setOpen(false);
        await queryClient.invalidateQueries({ queryKey: ['spending-list'] });
      } else {
        toast.error(resp.message);
      }
    },
    onError: error => {
      console.log(error);
      toast.error('Error adding item');
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button size="icon" asChild>
          <Plus size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(data => SubmitMutation.mutate(data))}
            className="space-y-4"
          >
            <FormInputSelect
              form={form}
              name="transaction_type"
              options={[
                { label: 'Income', value: 'credit' },
                { label: 'Expense', value: 'debit' },
              ]}
            />
            <FormInputDateOnly form={form} name="date" />
            <FormInput type="number" formObj={form} name="amount" />
            <FormInputSelect
              form={form}
              name="category"
              options={[
                { label: 'Food', value: 'food' },
                { label: 'Grocery', value: 'grocery' },
                { label: 'Entertainment', value: 'entertainment' },
                { label: 'Other', value: 'other' },
              ]}
            />
            <FormInputSelect
              form={form}
              name="payment_method"
              options={[
                { label: 'Cash', value: 'cash' },
                { label: 'Online', value: 'online' },
              ]}
            />
            <FormInput formObj={form} name="title" />
            <Button
              type="submit"
              disabled={SubmitMutation.isPending}
              className="w-full py-4"
            >
              {SubmitMutation.isPending ? (
                <Icon name="RotateCw" className="animate-spin" size={16} />
              ) : (
                <Icon name="Plus" size={16} />
              )}
              Add
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

const FormInputSchema = AddItemSchema.omit({
  date: true,
  category: true,
  payment_method: true,
  transaction_type: true,
});
type TFormInputSchema = z.infer<typeof FormInputSchema>;

interface TFormInput extends React.InputHTMLAttributes<HTMLInputElement> {
  formObj: UseFormReturn<TAddItemSchema>;
  name: keyof TFormInputSchema;
}
export function FormInput({ formObj, name, ...props }: TFormInput) {
  return (
    <FormField
      control={formObj.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input {...props} placeholder="Enter value" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

const DateSchema = AddItemSchema.pick({ date: true });
type TDateSchema = z.infer<typeof DateSchema>;
export function FormInputDateOnly({
  form,
  name,
}: {
  form: UseFormReturn<TAddItemSchema>;
  name: keyof TDateSchema;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-full pl-3 text-left font-normal',
                    !field.value && 'text-muted-foreground',
                  )}
                >
                  {field.value ? (
                    format(field.value, 'yyyy-MM-dd')
                  ) : (
                    <span>Select a date</span>
                  )}
                  <CalendarIcon className="ml-auto size-4 opacity-60" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disableNavigation
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

const FormInputSelectSchema = AddItemSchema.pick({
  category: true,
  payment_method: true,
  transaction_type: true,
});
type TFormInputSelectSchema = z.infer<typeof FormInputSelectSchema>;
export function FormInputSelect({
  form,
  name,
  options,
}: {
  form: UseFormReturn<TAddItemSchema>;
  name: keyof TFormInputSelectSchema;
  options: { label: string; value: string }[];
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a value" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
