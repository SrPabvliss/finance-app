export interface Transaction {
  id: number;
  user_id: number;
  amount: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  description?: string;
  payment_method_id?: number;
  date: string;
  // Nuevos campos
  shared_with_id?: number;
  scheduled_transaction_id?: number;
}

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  type?: 'INCOME' | 'EXPENSE';
  category?: string;
  payment_method_id?: number;
  min_amount?: number;
  max_amount?: number;
  // Nuevos filtros
  shared_with_me?: boolean;
  scheduled_only?: boolean;
}

export interface ScheduledTransaction {
  id: number;
  user_id: number;
  name: string;
  amount: string;
  category: string;
  description?: string;
  payment_method_id?: number;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  next_execution_date: string;
  active: boolean;
}
