import React from 'react';
import { GoalStats } from '../../types/goal';

interface BadgeProps {
  status: GoalStats['status'];
}

export const StatusBadge: React.FC<BadgeProps> = ({ status }) => {
  if (status === 'upcoming') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
        Sắp diễn ra
      </span>
    );
  }

  if (status === 'completed') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
        Đã kết thúc
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      Đang thực hiện
    </span>
  );
};

