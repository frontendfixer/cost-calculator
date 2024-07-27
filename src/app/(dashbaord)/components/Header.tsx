'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '~/app/Context/QueryKeys';
import Logo from '~/components/Logo';
import { constants } from '~/constants';
import { cn } from '~/lib/utils';
import { Statistics } from '../actions';

const Header = () => {
  const queryData = useQuery({
    queryKey: [queryKeys.currentMonthBalance],
    queryFn: async () => await Statistics.balance(),
  });
  const balance = queryData.data?.data.balance ?? 0;

  return (
    <header className="flex items-center justify-between border-b p-2 pb-3 shadow">
      <div className="flex items-end gap-4">
        <Logo className="" />
        <h1 className="hidden text-2xl font-semibold">
          {constants.app_name} app
        </h1>
      </div>
      {queryData.data && (
        <div className="flex items-center gap-3 text-xl">
          Balance:
          <span
            className={cn(
              'text-xl font-bold',
              balance < 0 ? 'text-destructive' : 'text-success',
            )}
          >
            {balance < 0 ? '-' : ''}₹{Math.abs(balance)}
          </span>
        </div>
      )}
    </header>
  );
};

export default Header;
