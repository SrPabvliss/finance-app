export interface Transaction {
  id: number;
  user_id: number;
  amount: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  description?: string;
  payment_method_id?: number;
  date: string;
}

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  type?: 'INCOME' | 'EXPENSE';
  category?: string;
  payment_method_id?: number;
  min_amount?: number;
  max_amount?: number;
}
