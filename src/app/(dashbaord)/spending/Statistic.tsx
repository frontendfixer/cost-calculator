'use client';

import { useQuery } from '@tanstack/react-query';
import { Transactions } from '../actions';
import Image from 'next/image';
import { Separator } from '~/components/ui/separator';
import { Skeleton } from '~/components/ui/skeleton';
import { queryKeys } from '~/app/Context/QueryKeys';

const Statistic = () => {
  const queryData = useQuery({
    queryKey: [queryKeys.spendingStatistic],
    queryFn: async () => await Transactions.stat(),
  });

  return (
    <div className="grid grid-cols-2 gap-4 p-3">
      {!queryData.data ? (
        <>
          <Skeleton className="h-20 rounded-lg" />
          <Skeleton className="h-20 rounded-lg" />
        </>
      ) : (
        <>
          <div className="flex items-center gap-3 rounded-lg bg-success/20 p-3">
            <Image
              src={'/icons/cash-in.svg'}
              alt="logo"
              width={48}
              height={48}
            />
            <Separator orientation="vertical" className="bg-success" />
            <h1 className="ml-auto text-3xl font-extrabold">
              {queryData.data?.data.totalIncome}
            </h1>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-destructive/20 p-3">
            <Image
              src={'/icons/cash-out.svg'}
              alt="logo"
              width={48}
              height={48}
            />
            <Separator orientation="vertical" className="bg-destructive" />
            <h1 className="ml-auto text-3xl font-extrabold">
              {queryData.data?.data.totalExpense}
            </h1>
          </div>
        </>
      )}
    </div>
  );
};

export default Statistic;
