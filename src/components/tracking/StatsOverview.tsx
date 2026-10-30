import React from 'react';
import { CheckCircle2, CalendarX, TrendingUp, Flame, Target } from 'lucide-react';
import { Goal, GoalStats } from '../../types/goal';
import { formatDisplayDate } from '../../utils/dateUtils';

interface StatsOverviewProps {
  goal: Goal;
  stats: GoalStats;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ goal, stats }) => {
  return (
    <div className="space-y-4">
      {/* 4 Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Đã hoàn thành */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Đã hoàn thành</p>
            <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-teal-700">
              {stats.completedDays}
              <span className="text-xs font-medium text-slate-400 ml-1">ngày</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Số lần đánh dấu thành công</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Chưa hoàn thành trong khoảng thời gian đã qua */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Chưa hoàn thành</p>
            <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-rose-600">
              {stats.missedDays}
              <span className="text-xs font-medium text-slate-400 ml-1">ngày</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Trong {stats.totalElapsedDays} ngày đã trôi qua</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <CalendarX className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Tỷ lệ hoàn thành */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tỷ lệ hoàn thành</p>
            <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-emerald-600">
              {stats.completionRate}
              <span className="text-base font-bold text-slate-400 ml-0.5">%</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Hiệu suất thời gian đã qua</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Chuỗi ngày liên tiếp */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Chuỗi liên tiếp</p>
            <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-amber-600">
              {stats.currentStreak}
              <span className="text-xs font-medium text-slate-400 ml-1">ngày</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Kỷ lục dài nhất: {stats.longestStreak} ngày</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 fill-amber-500" />
          </div>
        </div>
      </div>

      {/* Tổng quan tiến độ của mục tiêu (Overall Progress Banner) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-teal-100/60 text-teal-800">
              <Target className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-slate-800">Tổng quan tiến độ</span>
          </div>

          <div className="text-xs text-slate-500">
            {goal.endDate ? (
              <span>
                Kế hoạch: <strong>{formatDisplayDate(goal.startDate)}</strong> đến{' '}
                <strong>{formatDisplayDate(goal.endDate)}</strong> ({stats.totalPlannedDays} ngày)
              </span>
            ) : (
              <span>
                Bắt đầu từ ngày <strong>{formatDisplayDate(goal.startDate)}</strong> (Thói quen duy trì liên tục)
              </span>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5">
          <div
            className="bg-teal-700 h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${Math.min(100, goal.endDate && stats.overallProgressRate !== null ? stats.overallProgressRate : stats.completionRate)}%` }}
          />
        </div>

        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
          <span>
            {goal.endDate && stats.overallProgressRate !== null ? (
              <>Tiến độ toàn bộ mục tiêu: <strong className="text-teal-700">{stats.overallProgressRate}%</strong> ({stats.completedDays}/{stats.totalPlannedDays} ngày hoàn thành)</>
            ) : (
              <>Tỷ lệ hoàn thành thực tế: <strong className="text-teal-700">{stats.completionRate}%</strong> ({stats.completedDays}/{stats.totalElapsedDays} ngày đã qua)</>
            )}
          </span>
          <span className="italic text-slate-400">
            * Dữ liệu tính toán từ lịch sử tick thực tế
          </span>
        </div>
      </div>
    </div>
  );
};

