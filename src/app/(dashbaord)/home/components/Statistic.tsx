'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { Separator } from '~/components/ui/separator';
import { Skeleton } from '~/components/ui/skeleton';
import { queryKeys } from '~/app/Context/QueryKeys';
import { Transactions } from '../../actions';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { format } from 'date-fns';
import { TrendingUp } from 'lucide-react';

const Statistic = () => {
  const statData = useQuery({
    queryKey: [queryKeys.spendingStatistic],
    queryFn: async () => {
      const resp = await Transactions.stat();
      return resp.data;
    },
  });

  return (
    <div className="">
      {!statData.data ? (
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-20 rounded-lg" />
          <Skeleton className="h-20 rounded-lg" />
        </div>
      ) : (
        <Card className="max-w-screen-sm p-0">
          <CardHeader className="border-b px-2 py-3 text-base font-bold">
            <CardTitle>Spending on {format(new Date(), 'MMMM')}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 p-2 py-5">
            <div className="flex items-center gap-1 rounded-lg bg-success/20 p-2">
              <Image
                src={'/icons/cash-in.svg'}
                alt="logo"
                width={40}
                height={40}
              />
              <Separator orientation="vertical" className="bg-success" />
              <h1 className="ml-auto text-[1.5rem] font-extrabold text-success">
                {statData.data.thisMonth.income}
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
              <h1 className="ml-auto text-[1.5rem] font-extrabold text-destructive">
                {statData.data.thisMonth.expanse}
              </h1>
            </div>
          </CardContent>
          <CardFooter className="border-t p-3">
            <div className="flex items-center justify-center gap-2 font-medium">
              Spending is <TrendingUp className="h-4 w-4 text-destructive" /> by
              30% from last month
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default Statistic;
