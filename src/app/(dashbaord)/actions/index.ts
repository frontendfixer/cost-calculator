import { type TAddItemSchema } from '../components/AddItemModal';
import { addItem, getUser, listItems, spendingStat } from './actions';

export const User = {
  get: async (id: string) => await getUser(id),
};

export const Transactions = {
  add: async (data: TAddItemSchema) => await addItem(data),
  list: async () => await listItems(),
  stat: async () => await spendingStat(),
};
