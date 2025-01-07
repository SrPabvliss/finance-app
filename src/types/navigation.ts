import { Transaction } from './transactions';

export type TransactionStackParamList = {
  TransactionList: undefined;
  TransactionForm: {
    mode: 'create' | 'edit';
    transaction?: Transaction;
  };
  TransactionDetail: {
    transaction: Transaction;
  };
};
