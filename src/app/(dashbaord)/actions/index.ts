import { type TAddItemSchema } from '../components/AddItemModal';
import {
  addItem,
  currentMonthBalance,
  deleteItem,
  getUser,
  listItems,
  monthWiseStat,
  spendingStat,
} from './actions';

export const User = {
  get: async (id: string) => await getUser(id),
};

export const Transactions = {
  add: async (data: TAddItemSchema) => await addItem(data),
  list: async () => await listItems(),
  stat: async () => await spendingStat(),
  delete: async (id: string) => await deleteItem(id),
  monthWiseStat: async () => await monthWiseStat(),
};

export const Statistics = {
  balance: async () => await currentMonthBalance(),
  monthWise: async () => await monthWiseStat(),
  spending: async () => await spendingStat(),
};
