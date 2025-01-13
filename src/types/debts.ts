export interface Debt {
  id: number;
  user_id: number;
  creditor_id: number;
  description: string;
  original_amount: string;
  pending_amount: string;
  due_date: string;
  paid: boolean;
}
