
export interface Habit {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color: string;
  completedDates: string[]; // ISO date strings
  createdAt: string;
  frequency: Frequency;
}

export type Frequency = {
  type: "daily" | "weekly" | "custom";
  daysOfWeek?: number[]; // 0 = Sunday, 1 = Monday, etc. (only for weekly or custom)
  customInterval?: number; // Number of days between occurrences (only for custom)
};

export interface HabitCompletion {
  habitId: string;
  date: string; // ISO date string
  completed: boolean;
}

export interface HabitStats {
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  totalCompletions: number;
}
