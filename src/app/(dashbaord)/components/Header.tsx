import Logo from '~/components/Logo';
import { constants } from '~/constants';
import AddItemModal from './AddItemModal';

const Header = () => {
  return (
    <header className="flex justify-between gap-4 rounded-lg border border-b-2 p-2 shadow">
      <div className="flex items-center gap-2">
        <Logo className="size-6" />
        <h2 className="font-semibold">{constants.app_name}</h2>
      </div>
      <AddItemModal />
    </header>
  );
};

export default Header;
