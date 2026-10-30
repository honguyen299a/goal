import { useState, useEffect, useCallback, useMemo } from 'react';
import { Goal, GoalStats } from '../types/goal';
import {
  getStoredGoalById,
  getGoalCompletedDates,
  toggleGoalDateCompletion,
} from '../services/storage';
import { calculateGoalStats } from '../utils/statsCalculator';
import { getTodayString, isBefore, isAfter } from '../utils/dateUtils';

export function useGoalTracking(goalId: string | undefined) {
  const [goal, setGoal] = useState<Goal | null>(null);
  const [completedDates, setCompletedDates] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionFeedback, setActionFeedback] = useState<{
    message: string;
    type: 'success' | 'warning';
  } | null>(null);

  const loadData = useCallback(() => {
    if (!goalId) {
      setLoading(false);
      return;
    }
    const foundGoal = getStoredGoalById(goalId);
    if (foundGoal) {
      setGoal(foundGoal);
      const records = getGoalCompletedDates(goalId);
      setCompletedDates(records);
    } else {
      setGoal(null);
    }
    setLoading(false);
  }, [goalId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Kiểm tra xem một ngày có thể tương tác (tick / bỏ tick) hay không
  const checkDateValidation = useCallback(
    (dateString: string): { isValid: boolean; reason?: string } => {
      if (!goal) return { isValid: false, reason: 'Không tìm thấy thông tin mục tiêu.' };

      const today = getTodayString();

      // Không cho phép đánh dấu ngày trong tương lai
      if (isAfter(dateString, today)) {
        return { isValid: false, reason: 'Không thể đánh dấu cho những ngày trong tương lai.' };
      }

      // Không cho phép đánh dấu trước ngày bắt đầu
      if (isBefore(dateString, goal.startDate)) {
        return {
          isValid: false,
          reason: `Mục tiêu bắt đầu từ ngày ${goal.startDate}. Không thể đánh dấu trước ngày này.`,
        };
      }

      // Không cho phép đánh dấu sau ngày kết thúc (nếu có)
      if (goal.endDate && isAfter(dateString, goal.endDate)) {
        return {
          isValid: false,
          reason: `Mục tiêu kết thúc vào ngày ${goal.endDate}. Không thể đánh dấu sau ngày này.`,
        };
      }

      return { isValid: true };
    },
    [goal]
  );

  // Toggle tick / bỏ tick một ngày
  const toggleDate = useCallback(
    (dateString: string): boolean => {
      if (!goalId || !goal) return false;

      const validation = checkDateValidation(dateString);
      if (!validation.isValid) {
        setActionFeedback({
          message: validation.reason || 'Ngày này không hợp lệ để đánh dấu.',
          type: 'warning',
        });
        setTimeout(() => setActionFeedback(null), 3000);
        return false;
      }

      const isNowCompleted = toggleGoalDateCompletion(goalId, dateString);

      // Cập nhật state nội bộ
      if (isNowCompleted) {
        setCompletedDates((prev) => [...prev, dateString]);
        setActionFeedback({
          message: `Đã đánh dấu hoàn thành ngày ${dateString}! 🎉`,
          type: 'success',
        });
      } else {
        setCompletedDates((prev) => prev.filter((d) => d !== dateString));
        setActionFeedback({
          message: `Đã bỏ đánh dấu ngày ${dateString}.`,
          type: 'success',
        });
      }

      setTimeout(() => setActionFeedback(null), 2500);
      return true;
    },
    [goalId, goal, checkDateValidation]
  );

  // Tính toán số liệu thống kê tự động dựa trên completedDates thực tế
  const stats: GoalStats | null = useMemo(() => {
    if (!goal) return null;
    return calculateGoalStats(goal, completedDates);
  }, [goal, completedDates]);

  return {
    goal,
    completedDates,
    stats,
    loading,
    actionFeedback,
    toggleDate,
    checkDateValidation,
    refreshTracking: loadData,
  };
}

