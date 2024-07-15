'use client';

import { useQuery } from '@tanstack/react-query';
import { Transactions } from '../../actions';
import { StatusCodes } from 'http-status-codes';
import Icon from '~/components/Icon';
import { cn, titleCase } from '~/lib/utils';
import { Separator } from '~/components/ui/separator';
import { type icons, MoveDownRight, MoveUpRight } from 'lucide-react';
import { type TListItems } from '../../actions/actions';
import { Fragment, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ListItemsSkeleton from '../../components/ListItemsSkeleton';
import { queryKeys } from '~/app/Context/QueryKeys';
import { type addItemCategoryList } from '~/server/db/schema';

const ListItemIcon: Record<
  (typeof addItemCategoryList)[number],
  keyof typeof icons
> = {
  food: 'Salad',
  entertainment: 'Drum',
  borrowing: 'IndianRupee',
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
        <div className="mb-2 h-full space-y-2 rounded-md bg-muted/20 p-2">
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
