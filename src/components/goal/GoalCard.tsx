import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle2, ChevronRight, Edit3, Trash2, Flame } from 'lucide-react';
import { Goal } from '../../types/goal';
import { getGoalCompletedDates } from '../../services/storage';
import { calculateGoalStats } from '../../utils/statsCalculator';
import { formatDisplayDate } from '../../utils/dateUtils';
import { StatusBadge } from '../common/Badge';
import { ConfirmModal } from '../common/ConfirmModal';

interface GoalCardProps {
  goal: Goal;
  onDelete: (id: string) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onDelete }) => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Tính toán số liệu thống kê thực tế cho thẻ này
  const completedDates = getGoalCompletedDates(goal.id);
  const stats = calculateGoalStats(goal, completedDates);

  const handleCardClick = () => {
    navigate(`/goals/${goal.id}`);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/goals/${goal.id}/edit`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    onDelete(goal.id);
    setShowDeleteModal(false);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="group relative bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-teal-500/50 transition-all duration-200 cursor-pointer flex flex-col justify-between"
      >
        <div>
          {/* Card top: Color pill & Actions */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <span
                className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                style={{ backgroundColor: goal.color || '#0F766E' }}
              />
              <StatusBadge status={stats.status} />
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={handleEditClick}
                className="p-1.5 rounded-lg text-slate-400 hover:text-teal-700 hover:bg-teal-50 transition-colors"
                title="Chỉnh sửa mục tiêu"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleDeleteClick}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Xóa mục tiêu"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Goal Title & Description */}
          <h3 className="mt-3 text-lg font-bold text-slate-900 group-hover:text-teal-800 transition-colors line-clamp-1">
            {goal.title}
          </h3>
          <p className="mt-1 text-sm text-slate-500 line-clamp-2 min-h-[2.5rem]">
            {goal.description || 'Không có mô tả chi tiết.'}
          </p>

          {/* Time range */}
          <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              {formatDisplayDate(goal.startDate)}
              {goal.endDate ? ` → ${formatDisplayDate(goal.endDate)}` : ' (Không giới hạn)'}
            </span>
          </div>
        </div>

        {/* Progress & Stats Footer */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs font-medium mb-1.5">
            <span className="text-slate-500 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
              <span>{stats.completedDays} ngày đã tick</span>
            </span>

            {stats.currentStreak > 0 && (
              <span className="text-amber-600 flex items-center gap-0.5 font-semibold bg-amber-50 px-1.5 py-0.5 rounded">
                <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                {stats.currentStreak} ngày liên tiếp
              </span>
            )}

            <span className="text-teal-700 font-bold">{stats.completionRate}%</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-teal-600 transition-all duration-500"
              style={{ width: `${Math.min(100, stats.completionRate)}%` }}
            />
          </div>

          {/* Action prompt */}
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 group-hover:text-teal-700 transition-colors pt-1">
            <span className="font-medium">Mở bảng theo dõi</span>
            <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Xóa mục tiêu này?"
        message={`Bạn có chắc muốn xóa mục tiêu "${goal.title}"? Thao tác này sẽ xóa vĩnh viễn mục tiêu và toàn bộ lịch sử theo dõi ngày của mục tiêu này.`}
        confirmLabel="Xóa mục tiêu"
        cancelLabel="Hủy"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  );
};

