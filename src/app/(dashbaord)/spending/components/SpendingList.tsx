'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { StatusCodes } from 'http-status-codes';
import {
  Loader2,
  MoveDownRight,
  MoveUpRight,
  Trash2,
  type icons,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { MutationKeys, queryKeys } from '~/app/Context/QueryKeys';
import Icon from '~/components/Icon';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { cn, titleCase } from '~/lib/utils';
import { type addItemCategoryList } from '~/server/db/schema';
import { Transactions } from '../../actions';
import { type TListItems } from '../../actions/actions';
import ListItemsSkeleton from '../../components/ListItemsSkeleton';

const ListItemIcon: Record<
  (typeof addItemCategoryList)[number],
  keyof typeof icons
> = {
  food: 'Salad',
  entertainment: 'Drum',
  lend: 'Banknote',
  borrow: 'IndianRupee',
  clothing: 'Shirt',
  grocery: 'ShoppingCart',
  market: 'Wheat',
  donation: 'HandCoins',
  investment: 'CandlestickChart',
  loan: 'Banknote',
  medicine: 'Pill',
  salary: 'Wallet',
  other: 'ReceiptIndianRupee',
};

const SpendingList = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') ?? '';
  const [spendingList, setSpendingList] = useState<TListItems>([]);

  const queryClient = useQueryClient();

  const invalidateQueries = async () => {
    return await Promise.all([
      queryClient.invalidateQueries({
        queryKey: [queryKeys.spendingList],
      }),
      queryClient.invalidateQueries({
        queryKey: [queryKeys.currentMonthBalance],
      }),
    ]);
  };

  const spendingListQuery = useQuery({
    queryKey: [queryKeys.spendingList],
    queryFn: async () => {
      const list = await Transactions.list();
      if (list.status === StatusCodes.OK) {
        setSpendingList(list.data);
        return list.data;
      }
      return [];
    },
  });
  const deleteItemMutation = useMutation({
    mutationKey: [MutationKeys.deleteItem],
    mutationFn: async (id: string) => {
      const query = await Transactions.delete(id);
      if (query.status === StatusCodes.OK) {
        toast.success(query.message);
        await invalidateQueries();
      } else {
        toast.error(query.message);
      }
    },
  });

  useEffect(() => {
    if (spendingListQuery.data) {
      setSpendingList(
        type
          ? spendingListQuery.data.filter(
              item => item.transaction_type === type,
            )
          : spendingListQuery.data,
      );
    }
  }, [spendingListQuery.data, type]);

  return (
    <>
      {spendingListQuery.isLoading ? (
        <ListItemsSkeleton />
      ) : (
        <div className="my-2 h-full space-y-2 rounded-md bg-muted/20">
          {!spendingList?.length ? (
            <p>No transactions found</p>
          ) : (
            spendingList.map((item, k) => (
              <Fragment key={item.id}>
                <div
                  className={cn(
                    'flex items-center justify-between rounded-lg p-2',
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="grid size-8 place-content-center rounded-full bg-primary p-2 text-primary-foreground">
                      <Icon name={ListItemIcon[item.category]} size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold">{titleCase(item.title)}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.date} {item.time}
                      </p>
                    </div>
                  </div>
                  <div
                    className={cn(
                      'flex gap-1',
                      item.transaction_type === 'debit'
                        ? 'items-start text-error'
                        : 'items-end text-success',
                    )}
                  >
                    <strong className="text-lg leading-none">
                      &#8377;{item.amount}
                    </strong>
                    {item.transaction_type === 'debit' ? (
                      <MoveDownRight size={20} className="text-error" />
                    ) : (
                      <MoveUpRight size={20} className="text-success" />
                    )}
                  </div>
                  <Button
                    size="icon"
                    className="size-8"
                    variant="destructive"
                    disabled={
                      deleteItemMutation.isPending &&
                      deleteItemMutation.variables === item.id
                    }
                    onClick={() => deleteItemMutation.mutate(item.id)}
                  >
                    {deleteItemMutation.isPending &&
                    deleteItemMutation.variables === item.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </Button>
                </div>
                {spendingListQuery?.data!.length - 1 !== k && <Separator />}
              </Fragment>
            ))
          )}
        </div>
      )}
    </>
  );
};

export default SpendingList;
