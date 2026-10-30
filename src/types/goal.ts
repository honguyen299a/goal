export interface Goal {
  id: string;
  title: string;
  description: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string | null; // YYYY-MM-DD
  color?: string; // Hex or color key
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export type GoalFormData = Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>;

export interface GoalTrackingRecord {
  goalId: string;
  completedDates: string[]; // List of YYYY-MM-DD strings
}

export interface GoalStats {
  completedDays: number;
  missedDays: number;
  totalElapsedDays: number;
  completionRate: number; // percentage (0 - 100)
  currentStreak: number;
  longestStreak: number;
  totalPlannedDays: number | null; // if endDate exists
  overallProgressRate: number | null; // if endDate exists
  status: 'upcoming' | 'in_progress' | 'completed';
}

export interface DayStatus {
  dateString: string; // YYYY-MM-DD
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isFuture: boolean;
  isOutOfRange: boolean; // Before startDate or after endDate
  isCompleted: boolean;
  isInteractive: boolean; // Can be toggled
  disabledReason?: string;
}

