import { ScrollArea } from '~/components/ui/scroll-area';
import Filters from './Filters';
import SpendingList from './SpendingList';
import Statistic from './Statistic';

const SpendingPage = () => {
  return (
    <div className="flex h-full flex-col">
      <Statistic />
      <div className="flex items-center justify-between gap-4 p-3">
        <h1 className="text-2xl font-extrabold">Transactions</h1>
        <Filters />
      </div>
      <ScrollArea className="h-full">
        <SpendingList />
      </ScrollArea>
    </div>
  );
};

export default SpendingPage;
