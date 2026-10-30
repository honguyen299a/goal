import { Goal, GoalStats } from '../types/goal';
import {
  getTodayString,
  isBefore,
  isAfter,
  addDays,
  getInclusiveDaysCount,
  getDatesRange,
} from './dateUtils';

/**
 * Tính toán số liệu thống kê thực tế cho một mục tiêu dựa trên danh sách ngày đã hoàn thành
 */
export function calculateGoalStats(goal: Goal, completedDatesArray: string[]): GoalStats {
  const today = getTodayString();
  const completedSet = new Set(completedDatesArray);

  const { startDate, endDate } = goal;

  // Xác định trạng thái mục tiêu
  let status: GoalStats['status'] = 'in_progress';
  if (isAfter(startDate, today)) {
    status = 'upcoming';
  } else if (endDate && isAfter(today, endDate)) {
    status = 'completed';
  }

  // Nếu mục tiêu chưa tới ngày bắt đầu
  if (isAfter(startDate, today)) {
    return {
      completedDays: 0,
      missedDays: 0,
      totalElapsedDays: 0,
      completionRate: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalPlannedDays: endDate ? getInclusiveDaysCount(startDate, endDate) : null,
      overallProgressRate: 0,
      status: 'upcoming',
    };
  }

  // Ngày kết thúc của giai đoạn đã diễn ra (tính tới hôm nay hoặc endDate nếu endDate < today)
  const lastElapsedDate = endDate && isBefore(endDate, today) ? endDate : today;

  // Danh sách toàn bộ các ngày đã trôi qua kể từ ngày bắt đầu mục tiêu
  const elapsedDates = getDatesRange(startDate, lastElapsedDate);
  const totalElapsedDays = elapsedDates.length;

  // Đếm các ngày đã hoàn thành thực tế nằm trong khoảng thời gian hợp lệ
  let completedDays = 0;
  for (const date of elapsedDates) {
    if (completedSet.has(date)) {
      completedDays++;
    }
  }

  // Số ngày chưa hoàn thành trong khoảng thời gian đã qua
  const missedDays = Math.max(0, totalElapsedDays - completedDays);

  // Tỷ lệ hoàn thành so với thời gian đã qua (%)
  const completionRate =
    totalElapsedDays > 0 ? Math.round((completedDays / totalElapsedDays) * 100) : 0;

  // Tính Streak dài nhất trong lịch sử (longestStreak)
  let longestStreak = 0;
  let tempStreak = 0;
  for (const date of elapsedDates) {
    if (completedSet.has(date)) {
      tempStreak++;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  }

  // Tính Streak hiện tại (currentStreak)
  // Tính ngược từ hôm nay hoặc hôm qua
  let currentStreak = 0;
  const yesterday = addDays(today, -1);

  // Bắt đầu từ ngày kiểm tra thích hợp:
  // Nếu hôm nay đã tick -> đếm từ hôm nay lùi về
  // Nếu hôm nay chưa tick nhưng hôm qua có tick -> đếm từ hôm qua lùi về (vẫn giữ streak trong ngày hiện tại)
  let checkDate: string | null = null;
  if (completedSet.has(today)) {
    checkDate = today;
  } else if (completedSet.has(yesterday) && !isBefore(yesterday, startDate)) {
    checkDate = yesterday;
  }

  if (checkDate) {
    let curr = checkDate;
    while (!isBefore(curr, startDate) && completedSet.has(curr)) {
      currentStreak++;
      curr = addDays(curr, -1);
    }
  }

  // Tổng quan tiến độ nếu có ngày kết thúc
  let totalPlannedDays: number | null = null;
  let overallProgressRate: number | null = null;

  if (endDate) {
    totalPlannedDays = getInclusiveDaysCount(startDate, endDate);
    if (totalPlannedDays > 0) {
      overallProgressRate = Math.min(100, Math.round((completedDays / totalPlannedDays) * 100));
    }
  }

  return {
    completedDays,
    missedDays,
    totalElapsedDays,
    completionRate,
    currentStreak,
    longestStreak,
    totalPlannedDays,
    overallProgressRate,
    status,
  };
}

