export interface Goal {
  id: number;
  user_id: number;
  shared_user_id?: number | null;
  name: string;
  target_amount: string;
  current_amount: string;
  end_date: string;
}
