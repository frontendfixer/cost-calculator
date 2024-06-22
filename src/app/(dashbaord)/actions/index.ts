import { type TAddItemSchema } from '../components/AddItemModal';
import { addItem, getUser, listItems } from './actions';

export const User = {
  get: async (id: string) => await getUser(id),
};

export const Transactions = {
  add: async (data: TAddItemSchema) => await addItem(data),
  list: async () => await listItems(),
};
