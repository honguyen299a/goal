import { Goal, GoalFormData } from '../types/goal';
import { getTodayString, addDays } from '../utils/dateUtils';

const GOALS_STORAGE_KEY = 'my_goals_list';
const RECORDS_STORAGE_PREFIX = 'my_goals_records_';

/**
 * Lấy toàn bộ danh sách mục tiêu từ LocalStorage
 */
export function getStoredGoals(): Goal[] {
  try {
    const raw = localStorage.getItem(GOALS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Goal[];
  } catch (error) {
    console.error('Lỗi khi đọc danh sách mục tiêu từ LocalStorage:', error);
    return [];
  }
}

/**
 * Lấy chi tiết một mục tiêu theo ID
 */
export function getStoredGoalById(goalId: string): Goal | null {
  const goals = getStoredGoals();
  return goals.find((g) => g.id === goalId) || null;
}

/**
 * Lưu danh sách mục tiêu vào LocalStorage
 */
function persistGoals(goals: Goal[]): void {
  try {
    localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
  } catch (error) {
    console.error('Lỗi khi ghi danh sách mục tiêu vào LocalStorage:', error);
  }
}

/**
 * Tạo mới hoặc cập nhật một mục tiêu
 */
export function saveStoredGoal(data: GoalFormData, existingId?: string): Goal {
  const goals = getStoredGoals();
  const now = new Date().toISOString();

  if (existingId) {
    const index = goals.findIndex((g) => g.id === existingId);
    if (index !== -1) {
      const updated: Goal = {
        ...goals[index],
        title: data.title.trim(),
        description: data.description.trim(),
        startDate: data.startDate,
        endDate: data.endDate ? data.endDate : null,
        color: data.color || goals[index].color || '#0F766E',
        updatedAt: now,
      };
      goals[index] = updated;
      persistGoals(goals);
      return updated;
    }
  }

  // Tạo ID ngẫu nhiên duy nhất
  const newId = 'goal_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
  const newGoal: Goal = {
    id: newId,
    title: data.title.trim(),
    description: data.description.trim(),
    startDate: data.startDate,
    endDate: data.endDate ? data.endDate : null,
    color: data.color || '#0F766E',
    createdAt: now,
    updatedAt: now,
  };

  goals.unshift(newGoal);
  persistGoals(goals);
  return newGoal;
}

/**
 * Xóa mục tiêu và xóa TOÀN BỘ dữ liệu theo dõi liên quan của mục tiêu đó
 */
export function deleteStoredGoal(goalId: string): void {
  const goals = getStoredGoals();
  const filtered = goals.filter((g) => g.id !== goalId);
  persistGoals(filtered);

  // Xóa sạch dữ liệu tracking riêng của goal này
  try {
    localStorage.removeItem(RECORDS_STORAGE_PREFIX + goalId);
  } catch (error) {
    console.error('Lỗi khi xóa dữ liệu theo dõi mục tiêu:', error);
  }
}

/**
 * Lấy danh sách các ngày đã hoàn thành của một mục tiêu cụ thể
 * Trả về mảng các chuỗi ngày YYYY-MM-DD
 */
export function getGoalCompletedDates(goalId: string): string[] {
  try {
    const raw = localStorage.getItem(RECORDS_STORAGE_PREFIX + goalId);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (error) {
    console.error(`Lỗi khi đọc dữ liệu hoàn thành cho mục tiêu ${goalId}:`, error);
    return [];
  }
}

/**
 * Cập nhật danh sách các ngày đã hoàn thành của một mục tiêu
 */
export function setGoalCompletedDates(goalId: string, dates: string[]): void {
  try {
    // Đảm bảo không trùng lặp và sắp xếp theo ngày tăng dần
    const uniqueDates = Array.from(new Set(dates)).sort();
    localStorage.setItem(RECORDS_STORAGE_PREFIX + goalId, JSON.stringify(uniqueDates));
  } catch (error) {
    console.error(`Lỗi khi lưu dữ liệu hoàn thành cho mục tiêu ${goalId}:`, error);
  }
}

/**
 * Chuyển đổi trạng thái hoàn thành (tick / bỏ tick) cho một ngày cụ thể của mục tiêu
 * @returns boolean true nếu sau khi toggle là HOÀN THÀNH, false nếu BỎ ĐÁNH DẤU
 */
export function toggleGoalDateCompletion(goalId: string, dateString: string): boolean {
  const dates = getGoalCompletedDates(goalId);
  const exists = dates.includes(dateString);

  let newDates: string[];
  let isNowCompleted: boolean;

  if (exists) {
    newDates = dates.filter((d) => d !== dateString);
    isNowCompleted = false;
  } else {
    newDates = [...dates, dateString];
    isNowCompleted = true;
  }

  setGoalCompletedDates(goalId, newDates);
  return isNowCompleted;
}

/**
 * Khởi tạo dữ liệu mẫu nếu người dùng lần đầu mở ứng dụng
 */
export function initializeSampleDataIfEmpty(): void {
  const goals = getStoredGoals();
  if (goals.length > 0) return;

  const today = getTodayString();
  const thirtyDaysAgo = addDays(today, -20);
  const tenDaysAgo = addDays(today, -10);
  const futureDate = addDays(today, 30);

  const sample1 = saveStoredGoal({
    title: 'Học tiếng Anh mỗi ngày',
    description: 'Học 30 từ vựng mới và luyện nghe podcast tiếng Anh 20 phút',
    startDate: thirtyDaysAgo,
    endDate: futureDate,
    color: '#0F766E',
  });

  const sample2 = saveStoredGoal({
    title: 'Chạy bộ 3km buổi sáng',
    description: 'Duy trì thói quen chạy bộ nhẹ nhàng trước 7 giờ sáng',
    startDate: tenDaysAgo,
    endDate: null,
    color: '#0284C7',
  });

  // Tick một vài ngày thực tế của sample1 để minh họa
  const sample1Dates = [
    addDays(today, -15),
    addDays(today, -14),
    addDays(today, -13),
    addDays(today, -10),
    addDays(today, -9),
    addDays(today, -8),
    addDays(today, -2),
    addDays(today, -1),
    today,
  ];
  setGoalCompletedDates(sample1.id, sample1Dates);

  // sample2 có các ngày hoàn toàn khác biệt để kiểm chứng độc lập
  const sample2Dates = [
    addDays(today, -7),
    addDays(today, -6),
    addDays(today, -5),
    addDays(today, -4),
    addDays(today, -3),
    addDays(today, -2),
    addDays(today, -1),
  ];
  setGoalCompletedDates(sample2.id, sample2Dates);
}

