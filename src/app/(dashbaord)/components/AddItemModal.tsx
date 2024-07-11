'use client';

import { Plus } from 'lucide-react';
import { type UseFormReturn, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import * as Dialog from '~/components/ui/dialog';
import * as Popover from '~/components/ui/popover';
import * as Select from '~/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import { queryKeys } from '~/app/Context/QueryKeys';
import { addItemCategoryList } from '~/server/db/schema';

export const AddItemSchema = z.object({
  transaction_type: z.enum(['credit', 'debit']),
  date: z.date(),
  amount: z.string().regex(/^[0-9]+$/, 'Amount must be a number'),
  category: z.enum(addItemCategoryList),
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
  const invalidateQueries = async () => {
    return await Promise.all([
      queryClient.invalidateQueries({
        queryKey: [queryKeys.spendingList],
        exact: true,
      }),
      queryClient.invalidateQueries({
        queryKey: [queryKeys.spendingStatistic],
        exact: true,
      }),
    ]);
  };
  const SubmitMutation = useMutation({
    mutationKey: ['add-item'],
    mutationFn: async (data: TAddItemSchema) => await Transactions.add(data),
    onSuccess: async resp => {
      if (resp.status === StatusCodes.OK) {
        toast.success(resp.message);
        form.reset();
        setOpen(false);
        await invalidateQueries();
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
    <Dialog.Dialog open={open} onOpenChange={setOpen}>
      <Dialog.DialogTrigger>
        <Button size="icon" asChild>
          <Plus size={16} />
        </Button>
      </Dialog.DialogTrigger>
      <Dialog.DialogContent>
        <Dialog.DialogHeader className="border-b pb-3">
          <Dialog.DialogTitle className="text-2xl">Add Item</Dialog.DialogTitle>
          <Dialog.DialogDescription>
            Add a new item to your spending list
          </Dialog.DialogDescription>
        </Dialog.DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(data => SubmitMutation.mutate(data))}
            className="space-y-4"
          >
            <FormInputSelect
              form={form}
              name="transaction_type"
              label="Transaction type"
              options={[
                { label: 'Income', value: 'credit' },
                { label: 'Expense', value: 'debit' },
              ]}
            />
            <FormInputDateOnly form={form} name="date" label="Select Date" />
            <FormInput
              type="number"
              formObj={form}
              name="amount"
              label="Amount"
            />
            <FormInputSelect
              form={form}
              name="category"
              label="Category"
              options={
                form.getValues('transaction_type') === 'debit'
                  ? [
                      { label: 'Food', value: 'food' },
                      { label: 'Medicine', value: 'medicine' },
                      { label: 'Grocery', value: 'grocery' },
                      { label: 'Entertainment', value: 'entertainment' },
                      { label: 'Investment', value: 'investment' },
                      { label: 'Other', value: 'other' },
                    ]
                  : [
                      { label: 'Salary', value: 'salary' },
                      { label: 'Loan', value: 'loan' },
                      { label: 'Other', value: 'other' },
                    ]
              }
            />
            <FormInputSelect
              form={form}
              name="payment_method"
              label="Payment method"
              options={[
                { label: 'Cash', value: 'cash' },
                { label: 'Online', value: 'online' },
              ]}
            />
            <FormInput formObj={form} name="title" label="Title" />
            <Button
              type="submit"
              disabled={SubmitMutation.isPending}
              className="w-full"
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
      </Dialog.DialogContent>
    </Dialog.Dialog>
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
  label?: string;
}
export function FormInput({ formObj, name, label, ...props }: TFormInput) {
  return (
    <FormField
      control={formObj.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
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
  label,
}: {
  form: UseFormReturn<TAddItemSchema>;
  name: keyof TDateSchema;
  label?: string;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover.Popover>
            <Popover.PopoverTrigger asChild>
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
            </Popover.PopoverTrigger>
            <Popover.PopoverContent className="w-full p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disableNavigation
                weekStartsOn={1}
              />
            </Popover.PopoverContent>
          </Popover.Popover>
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
  label,
  options,
}: {
  form: UseFormReturn<TAddItemSchema>;
  name: keyof TFormInputSelectSchema;
  label?: string;
  options: { label: string; value: string }[];
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select.Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <Select.SelectTrigger>
                <Select.SelectValue placeholder="Select a value" />
              </Select.SelectTrigger>
            </FormControl>
            <Select.SelectContent>
              {options.map(option => (
                <Select.SelectItem key={option.value} value={option.value}>
                  {option.label}
                </Select.SelectItem>
              ))}
            </Select.SelectContent>
          </Select.Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
