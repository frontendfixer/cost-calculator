import Filters from './Filters';
import SpendingList from './SpendingList';

const SpendingPage = () => {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-4 p-3">
        <h1 className="text-2xl font-extrabold">Transactions</h1>
        <Filters />
      </div>
      <SpendingList />
    </div>
  );
};

export default SpendingPage;
