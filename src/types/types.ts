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
  Goals: undefined;
  Profile: undefined;
  PaymentMethods: undefined;
};
