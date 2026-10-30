import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { MONTH_NAMES } from '../../utils/dateUtils';

interface MonthYearPickerProps {
  currentMonth: number; // 1-12
  currentYear: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectMonth: (month: number) => void;
  onSelectYear: (year: number) => void;
  onResetToCurrentMonth: () => void;
}

export const MonthYearPicker: React.FC<MonthYearPickerProps> = ({
  currentMonth,
  currentYear,
  onPrevMonth,
  onNextMonth,
  onSelectMonth,
  onSelectYear,
  onResetToCurrentMonth,
}) => {
  const now = new Date();
  const realCurrentMonth = now.getMonth() + 1;
  const realCurrentYear = now.getFullYear();

  const isCurrentMonthNow = currentMonth === realCurrentMonth && currentYear === realCurrentYear;

  // Danh sách các năm để chọn (từ năm hiện tại - 5 đến năm hiện tại + 5)
  const yearsList = Array.from({ length: 11 }, (_, i) => realCurrentYear - 5 + i);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs">
      {/* Title & Today quick button */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
          <CalendarIcon className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">Lịch theo dõi</span>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 leading-tight">
            {MONTH_NAMES[currentMonth - 1]} năm {currentYear}
          </h2>
        </div>
      </div>

      {/* Selectors and Navigation Controls */}
      <div className="flex items-center gap-2">
        {!isCurrentMonthNow && (
          <button
            type="button"
            onClick={onResetToCurrentMonth}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200/60 transition-colors"
          >
            Về tháng này
          </button>
        )}

        {/* Month Selector */}
        <select
          value={currentMonth}
          onChange={(e) => onSelectMonth(Number(e.target.value))}
          className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-500 transition-colors"
        >
          {MONTH_NAMES.map((name, idx) => (
            <option key={name} value={idx + 1}>
              {name}
            </option>
          ))}
        </select>

        {/* Year Selector */}
        <select
          value={currentYear}
          onChange={(e) => onSelectYear(Number(e.target.value))}
          className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-500 transition-colors"
        >
          {yearsList.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        {/* Prev / Next Buttons */}
        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
          <button
            type="button"
            onClick={onPrevMonth}
            className="p-1.5 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 transition-colors"
            title="Tháng trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="w-[1px] h-4 bg-slate-200" />
          <button
            type="button"
            onClick={onNextMonth}
            className="p-1.5 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 transition-colors"
            title="Tháng sau"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

