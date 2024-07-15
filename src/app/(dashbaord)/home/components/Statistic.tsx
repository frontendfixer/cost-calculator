'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { Separator } from '~/components/ui/separator';
import { Skeleton } from '~/components/ui/skeleton';
import { queryKeys } from '~/app/Context/QueryKeys';
import { Transactions } from '../../actions';

const Statistic = () => {
  const queryData = useQuery({
    queryKey: [queryKeys.spendingStatistic],
    queryFn: async () => await Transactions.stat(),
  });

  return (
    <div className="">
      {!queryData.data ? (
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-20 rounded-lg" />
          <Skeleton className="h-20 rounded-lg" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 rounded-lg border bg-muted p-2">
          <h3 className="col-span-2 text-muted-foreground">This month</h3>
          <div className="flex items-center gap-1 rounded-lg bg-success/20 p-2">
            <Image
              src={'/icons/cash-in.svg'}
              alt="logo"
              width={40}
              height={40}
            />
            <Separator orientation="vertical" className="bg-success" />
            <h1 className="ml-auto text-[1.5rem] font-extrabold">
              {queryData.data?.data.totalIncome}
            </h1>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-destructive/20 p-3">
            <Image
              src={'/icons/cash-out.svg'}
              alt="logo"
              width={40}
              height={40}
            />
            <Separator orientation="vertical" className="bg-destructive" />
            <h1 className="ml-auto text-[1.5rem] font-extrabold">
              {queryData.data?.data.totalExpense}
            </h1>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistic;
