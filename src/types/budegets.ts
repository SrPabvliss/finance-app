export interface Budget {
  id: number;
  user_id: number;
  shared_user_id?: number | null;
  category: string;
  limit_amount: string;
  current_amount: string;
  month: string;
}
