/**
 * Tiện ích xử lý ngày tháng chuẩn xác theo định dạng YYYY-MM-DD
 */

// Lấy ngày hôm nay dưới dạng YYYY-MM-DD theo giờ địa phương
export function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Format Date object thành YYYY-MM-DD
export function formatDateToString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Parse chuỗi YYYY-MM-DD thành Date an toàn (đặt vào giữa trưa 12:00 để tránh sai lệch timezone)
export function parseDateSafe(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

// So sánh 2 chuỗi YYYY-MM-DD: dateA < dateB
export function isBefore(dateA: string, dateB: string): boolean {
  return dateA < dateB;
}

// So sánh 2 chuỗi YYYY-MM-DD: dateA > dateB
export function isAfter(dateA: string, dateB: string): boolean {
  return dateA > dateB;
}

// Định dạng hiển thị ngày tiếng Việt (VD: 31/10/2026)
export function formatDisplayDate(dateString: string | null | undefined): string {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}

// Thêm N ngày vào chuỗi ngày YYYY-MM-DD
export function addDays(dateString: string, days: number): string {
  const d = parseDateSafe(dateString);
  d.setDate(d.getDate() + days);
  return formatDateToString(d);
}

// Tính số ngày chênh lệch giữa 2 ngày (bao gồm cả ngày bắt đầu và kết thúc)
// Ví dụ: 2026-10-01 đến 2026-10-01 là 1 ngày
export function getInclusiveDaysCount(startDate: string, endDate: string): number {
  if (isAfter(startDate, endDate)) return 0;
  const start = parseDateSafe(startDate).getTime();
  const end = parseDateSafe(endDate).getTime();
  const diffTime = end - start;
  return Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

// Tạo danh sách tất cả các ngày từ start đến end
export function getDatesRange(startDate: string, endDate: string): string[] {
  if (isAfter(startDate, endDate)) return [];
  const dates: string[] = [];
  let current = startDate;
  while (!isAfter(current, endDate)) {
    dates.push(current);
    current = addDays(current, 1);
  }
  return dates;
}

// Tên các thứ trong tuần (Bắt đầu từ Thứ 2 theo chuẩn Việt Nam)
export const WEEK_DAYS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];
export const WEEK_DAYS_SHORT = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

export const MONTH_NAMES = [
  'Tháng 1',
  'Tháng 2',
  'Tháng 3',
  'Tháng 4',
  'Tháng 5',
  'Tháng 6',
  'Tháng 7',
  'Tháng 8',
  'Tháng 9',
  'Tháng 10',
  'Tháng 11',
  'Tháng 12',
];

export interface CalendarCell {
  dateString: string;
  dayNumber: number;
  month: number; // 1-12
  year: number;
  isCurrentMonth: boolean;
}

/**
 * Sinh lưới ngày cho lịch tháng (42 ô: 6 tuần x 7 ngày, bắt đầu từ Thứ 2)
 * @param year Năm
 * @param month Tháng (1-12)
 */
export function generateMonthCalendar(year: number, month: number): CalendarCell[] {
  // Ngày 1 của tháng
  const firstDayOfMonth = new Date(year, month - 1, 1);
  // Thứ trong tuần của ngày 1 (0: CN, 1: T2, ..., 6: T7)
  let dayOfWeek = firstDayOfMonth.getDay();
  // Chuyển sang chuẩn Thứ 2 = 0, ..., CN = 6
  let startOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const cells: CalendarCell[] = [];

  // Lùi lại số ngày offset từ tháng trước
  const startDate = new Date(year, month - 1, 1 - startOffset, 12, 0, 0);

  for (let i = 0; i < 42; i++) {
    const current = new Date(startDate);
    current.setDate(startDate.getDate() + i);

    const cellYear = current.getFullYear();
    const cellMonth = current.getMonth() + 1;
    const cellDay = current.getDate();
    const dateString = formatDateToString(current);

    cells.push({
      dateString,
      dayNumber: cellDay,
      month: cellMonth,
      year: cellYear,
      isCurrentMonth: cellMonth === month && cellYear === year,
    });
  }

  return cells;
}

