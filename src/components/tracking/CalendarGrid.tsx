import React from 'react';
import { Check, Lock } from 'lucide-react';
import { Goal } from '../../types/goal';
import {
  WEEK_DAYS,
  generateMonthCalendar,
  getTodayString,
  isBefore,
  isAfter,
} from '../../utils/dateUtils';

interface CalendarGridProps {
  goal: Goal;
  year: number;
  month: number; // 1-12
  completedDates: string[];
  onToggleDate: (dateString: string) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  goal,
  year,
  month,
  completedDates,
  onToggleDate,
}) => {
  const today = getTodayString();
  const completedSet = new Set(completedDates);
  const cells = generateMonthCalendar(year, month);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Weekday Header */}
      <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/70 text-center">
        {WEEK_DAYS.map((dayName, idx) => (
          <div
            key={dayName}
            className={`py-3 text-xs font-semibold ${
              idx >= 5 ? 'text-teal-700/80' : 'text-slate-600'
            }`}
          >
            {dayName}
          </div>
        ))}
      </div>

      {/* Calendar Grid (6 rows x 7 cols) */}
      <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 bg-slate-100/40">
        {cells.map((cell) => {
          const { dateString, dayNumber, isCurrentMonth } = cell;

          const isCompleted = completedSet.has(dateString);
          const isToday = dateString === today;
          const isFuture = isAfter(dateString, today);
          const isBeforeStart = isBefore(dateString, goal.startDate);
          const isAfterEnd = Boolean(goal.endDate && isAfter(dateString, goal.endDate));

          const isOutOfRange = isBeforeStart || isAfterEnd;
          const isDisabled = isFuture || isOutOfRange;

          // Tooltip lý do không thể tương tác
          let disabledMessage = '';
          if (isFuture) {
            disabledMessage = 'Không thể đánh dấu ngày trong tương lai';
          } else if (isBeforeStart) {
            disabledMessage = `Chưa bắt đầu mục tiêu (bắt đầu từ ${goal.startDate})`;
          } else if (isAfterEnd) {
            disabledMessage = `Mục tiêu đã kết thúc vào ngày ${goal.endDate}`;
          }

          const handleClick = () => {
            if (isDisabled) return;
            onToggleDate(dateString);
          };

          return (
            <div
              key={dateString}
              onClick={handleClick}
              title={disabledMessage || (isCompleted ? 'Nhấn để bỏ đánh dấu' : 'Nhấn để đánh dấu hoàn thành')}
              className={`relative min-h-[70px] sm:min-h-[85px] p-2 flex flex-col justify-between transition-all select-none ${
                // Base background & opacity
                isDisabled
                  ? 'bg-slate-50/80 cursor-not-allowed opacity-45'
                  : 'bg-white cursor-pointer hover:bg-teal-50/40'
              } ${
                // Current month vs other months
                !isCurrentMonth ? 'text-slate-300' : 'text-slate-700'
              } ${
                // Selected/Completed state
                isCompleted
                  ? '!bg-[#0F766E] text-white shadow-inner shadow-teal-900/10'
                  : ''
              } ${
                // Today border indicator
                isToday && !isCompleted ? 'ring-2 ring-inset ring-teal-600 font-bold' : ''
              }`}
            >
              {/* Day header: Day Number & Today badge */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs sm:text-sm font-semibold rounded-full w-6 h-6 flex items-center justify-center ${
                    isToday && !isCompleted
                      ? 'bg-teal-700 text-white shadow-xs'
                      : isCompleted
                      ? 'text-white'
                      : isCurrentMonth
                      ? 'text-slate-800'
                      : 'text-slate-400'
                  }`}
                >
                  {dayNumber}
                </span>

                {isToday && !isCompleted && (
                  <span className="hidden sm:inline-block text-[10px] font-semibold uppercase tracking-wider text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                    Hôm nay
                  </span>
                )}

                {isDisabled && (
                  <span className="text-slate-300">
                    <Lock className="w-3 h-3" />
                  </span>
                )}
              </div>

              {/* Completion Icon & State */}
              <div className="flex items-center justify-center my-auto">
                {isCompleted ? (
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-xs animate-in zoom-in-75 duration-200">
                    <Check className="w-5 h-5 text-white" strokeWidth={3} />
                  </div>
                ) : !isDisabled && isCurrentMonth ? (
                  <div className="w-6 h-6 rounded-full border-2 border-dashed border-slate-200 hover:border-teal-400 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Check className="w-3.5 h-3.5 text-teal-600" />
                  </div>
                ) : null}
              </div>

              {/* Bottom status text */}
              <div className="text-[10px] text-center font-medium">
                {isCompleted ? (
                  <span className="text-teal-100 font-semibold">Đã xong</span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend 안내 */}
      <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-[#0F766E] flex items-center justify-center text-white">
              <Check className="w-3 h-3" strokeWidth={3} />
            </span>
            <span>Đã hoàn thành</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded border border-slate-300 bg-white" />
            <span>Chưa tick</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded border-2 border-teal-600 bg-teal-50" />
            <span>Hôm nay</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
              <Lock className="w-2.5 h-2.5" />
            </span>
            <span>Không khả dụng (Tương lai / Ngoài thời gian)</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 italic">
          * Nhấn vào ô để đánh dấu hoàn thành hoặc nhấn lại để bỏ đánh dấu.
        </p>
      </div>
    </div>
  );
};

