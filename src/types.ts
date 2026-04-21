export interface Habit {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  target_value: string;
  completed_today: boolean;
  created_at: string;
}

export interface WeeklyStat {
  date: string;
  count: number;
}
