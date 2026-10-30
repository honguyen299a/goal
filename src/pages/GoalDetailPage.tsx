import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, Edit3, Trash2, ArrowLeft, AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';
import { Header } from '../components/common/Header';
import { MonthYearPicker } from '../components/tracking/MonthYearPicker';
import { CalendarGrid } from '../components/tracking/CalendarGrid';
import { StatsOverview } from '../components/tracking/StatsOverview';
import { StatusBadge } from '../components/common/Badge';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { useGoalTracking } from '../hooks/useGoalTracking';
import { deleteStoredGoal } from '../services/storage';
import { formatDisplayDate } from '../utils/dateUtils';

export const GoalDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    goal,
    completedDates,
    stats,
    loading,
    actionFeedback,
    toggleDate,
  } = useGoalTracking(id);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // State cho tháng và năm được hiển thị trên lịch
  const now = new Date();
  const [viewMonth, setViewMonth] = useState<number>(now.getMonth() + 1); // 1-12
  const [viewYear, setViewYear] = useState<number>(now.getFullYear());

  const handlePrevMonth = () => {
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  const handleResetToCurrentMonth = () => {
    setViewMonth(now.getMonth() + 1);
    setViewYear(now.getFullYear());
  };

  const handleDeleteGoal = () => {
    if (id) {
      deleteStoredGoal(id);
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
        <Header showBack backTo="/" />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-slate-400">Đang tải thông tin mục tiêu...</p>
        </div>
      </div>
    );
  }

  if (!goal || !stats) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
        <Header showBack backTo="/" />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Không tìm thấy mục tiêu</h2>
          <p className="text-sm text-slate-500 mt-1 max-w-sm">
            Mục tiêu này không tồn tại hoặc đã bị xóa trước đó.
          </p>
          <Link
            to="/"
            className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-700 text-white text-sm font-medium hover:bg-teal-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Về danh sách mục tiêu</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      <Header showBack backTo="/" backLabel="Danh sách mục tiêu" />

      {/* Floating Action Toast / Feedback notification */}
      {actionFeedback && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-sm font-medium border ${
              actionFeedback.type === 'success'
                ? 'bg-slate-900 text-white border-slate-800'
                : 'bg-amber-50 text-amber-900 border-amber-300'
            }`}
          >
            {actionFeedback.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            )}
            <span>{actionFeedback.message}</span>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Goal Detail Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <span
                  className="w-4 h-4 rounded-full shrink-0 shadow-xs"
                  style={{ backgroundColor: goal.color || '#0F766E' }}
                />
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {goal.title}
                </h1>
                <StatusBadge status={stats.status} />
              </div>

              <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
                {goal.description || 'Chưa có mô tả chi tiết cho mục tiêu này.'}
              </p>

              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 pt-1">
                <Calendar className="w-4 h-4 text-teal-700 shrink-0" />
                <span>
                  Thời gian: <strong>{formatDisplayDate(goal.startDate)}</strong>
                  {goal.endDate ? (
                    <> → <strong>{formatDisplayDate(goal.endDate)}</strong></>
                  ) : (
                    ' (Không thời hạn kết thúc)'
                  )}
                </span>
              </div>
            </div>

            {/* Quick Action buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <Link
                to={`/goals/${goal.id}/edit`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Chỉnh sửa</span>
              </Link>
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa mục tiêu</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section: Thống kê mục tiêu (tính toán thực tế) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-slate-800">Thống kê hiệu suất</h2>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Chỉ số dựa trên dữ liệu tick thực tế</span>
            </div>
          </div>
          <StatsOverview goal={goal} stats={stats} />
        </div>

        {/* Section: Lịch theo dõi tháng riêng của mục tiêu */}
        <div className="space-y-4">
          <MonthYearPicker
            currentMonth={viewMonth}
            currentYear={viewYear}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onSelectMonth={setViewMonth}
            onSelectYear={setViewYear}
            onResetToCurrentMonth={handleResetToCurrentMonth}
          />

          <CalendarGrid
            goal={goal}
            year={viewYear}
            month={viewMonth}
            completedDates={completedDates}
            onToggleDate={toggleDate}
          />
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Xóa mục tiêu này?"
        message={`Bạn có chắc muốn xóa mục tiêu "${goal.title}"? Dữ liệu lịch sử và các ngày đã tick của mục tiêu này sẽ bị xóa hoàn toàn khỏi thiết bị.`}
        confirmLabel="Xác nhận xóa"
        cancelLabel="Hủy"
        onConfirm={handleDeleteGoal}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

