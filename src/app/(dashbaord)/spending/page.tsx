import Filters from './components/Filters';
import SpendingList from './components/SpendingList';

const SpendingPage = () => {
  return (
    <div className="grid grid-rows-[auto_1fr]">
      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold">Transactions</h1>
        <Filters />
      </div>
      <SpendingList />
    </div>
  );
};

export default SpendingPage;
