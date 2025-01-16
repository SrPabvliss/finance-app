import { Transaction } from './transactions';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Transactions: undefined;
  Debts: undefined;
  Goals: undefined;
  Budgets: undefined;
  Profile: undefined;
  PaymentMethods: undefined;
  Friends: undefined;
};
