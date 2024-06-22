'use client';

import { useQuery } from '@tanstack/react-query';
import { Transactions } from '../actions';
import { useIsClient } from '~/hooks/useIsClient';
import { StatusCodes } from 'http-status-codes';
import Icon from '~/components/Icon';
import { cn } from '~/lib/utils';
import { Separator } from '~/components/ui/separator';
import { MoveDownRight, MoveUpRight } from 'lucide-react';
import { type TListItems } from '../actions/actions';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const SpendingList = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') ?? 'all';

  const isClient = useIsClient();
  const [spendingList, setSpendingList] = useState<TListItems>([]);

  const spendingListQuery = useQuery({
    queryKey: ['spending-list'],
    queryFn: async () => {
      const list = await Transactions.list();
      if (list.status === StatusCodes.OK) {
        setSpendingList(list.data);
        return list.data;
      }
      return [];
    },
    enabled: isClient,
  });

  useEffect(() => {
    if (spendingListQuery.data && type) {
      setSpendingList(
        spendingListQuery.data.filter(item => item.transaction_type === type),
      );
    }
  }, [spendingListQuery.data, type]);

  if (!spendingList) return <div>loading</div>;
  return (
    <div className="mb-2 h-full space-y-2 rounded-md bg-muted/20 p-2">
      {!spendingList.length ? (
        <p>No transactions found</p>
      ) : (
        spendingList.map((item, k) => (
          <>
            <div
              key={item.id}
              className={cn('flex items-center justify-between rounded-lg p-2')}
            >
              <div className="flex items-center gap-3">
                <div className="grid size-8 place-content-center rounded-full bg-primary p-2 text-primary-foreground">
                  <Icon
                    name={
                      item.category === 'food'
                        ? 'Salad'
                        : item.category === 'grocery'
                          ? 'ShoppingBasket'
                          : item.category === 'entertainment'
                            ? 'Videotape'
                            : 'Shell'
                    }
                    size={20}
                  />
                </div>
                <div>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.date}</p>
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
          </>
        ))
      )}
    </div>
  );
};

export default SpendingList;
