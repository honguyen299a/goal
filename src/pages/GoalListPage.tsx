import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Target, Sparkles, CheckCircle2 } from 'lucide-react';
import { useGoals } from '../hooks/useGoals';
import { GoalCard } from '../components/goal/GoalCard';
import { Header } from '../components/common/Header';
import { getGoalCompletedDates } from '../services/storage';

export const GoalListPage: React.FC = () => {
  const { goals, loading, deleteGoal } = useGoals();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'hasDeadline'>('all');

  // Tính tổng số lượt hoàn thành trên toàn bộ mục tiêu
  const totalCompletedAllGoals = useMemo(() => {
    return goals.reduce((acc, goal) => {
      const dates = getGoalCompletedDates(goal.id);
      return acc + dates.length;
    }, 0);
  }, [goals]);

  // Lọc mục tiêu theo từ khóa tìm kiếm và bộ lọc
  const filteredGoals = useMemo(() => {
    return goals.filter((g) => {
      const matchesSearch =
        g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (g.description && g.description.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (filterStatus === 'hasDeadline') {
        return Boolean(g.endDate);
      }
      return true;
    });
  }, [goals, searchQuery, filterStatus]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Hero Banner / Quick Overview */}
        <div className="bg-gradient-to-br from-teal-800 via-teal-700 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-md shadow-teal-900/10 relative overflow-hidden">
          <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-teal-600/30 blur-2xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-teal-100 text-xs font-medium backdrop-blur-xs mb-3">
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span>Quản lý thói quen & Mục tiêu cá nhân</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              Kỷ luật mỗi ngày, kiến tạo tương lai
            </h2>
            <p className="mt-2 text-sm sm:text-base text-teal-100/90 leading-relaxed">
              Tạo mục tiêu, theo dõi chi tiết từng ngày với lịch riêng biệt và tích lũy chuỗi ngày kiên trì của bạn.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-xl backdrop-blur-xs">
                <Target className="w-4 h-4 text-teal-300" />
                <span>
                  <strong>{goals.length}</strong> mục tiêu đã tạo
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-xl backdrop-blur-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>
                  <strong>{totalCompletedAllGoals}</strong> ngày đã hoàn thành
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm mục tiêu..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-sm border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-500 transition-colors"
            />
          </div>

          {/* Filter options */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl text-xs font-medium text-slate-600">
              <button
                type="button"
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterStatus === 'all'
                    ? 'bg-white text-teal-800 font-semibold shadow-xs'
                    : 'hover:text-slate-900'
                }`}
              >
                Tất cả ({goals.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('hasDeadline')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterStatus === 'hasDeadline'
                    ? 'bg-white text-teal-800 font-semibold shadow-xs'
                    : 'hover:text-slate-900'
                }`}
              >
                Có hạn chót
              </button>
            </div>

            <Link
              to="/goals/new"
              className="inline-flex sm:hidden items-center justify-center p-2 rounded-xl bg-teal-700 text-white hover:bg-teal-800"
              title="Tạo mục tiêu mới"
            >
              <Plus className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Goals List Grid */}
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            Đang tải danh sách mục tiêu...
          </div>
        ) : filteredGoals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} onDelete={deleteGoal} />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-slate-200/80 shadow-xs max-w-lg mx-auto my-6">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {searchQuery ? 'Không tìm thấy mục tiêu nào phù hợp' : 'Chưa có mục tiêu nào'}
            </h3>
            <p className="mt-1.5 text-sm text-slate-500 max-w-sm mx-auto">
              {searchQuery
                ? 'Hãy thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc.'
                : 'Bắt đầu hành trình phát triển bản thân bằng cách tạo mục tiêu đầu tiên ngay hôm nay!'}
            </p>
            <div className="mt-6">
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Xóa tìm kiếm
                </button>
              ) : (
                <Link
                  to="/goals/new"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 text-white text-sm font-semibold hover:bg-teal-800 shadow-sm shadow-teal-700/25 transition-all hover:scale-105 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tạo mục tiêu đầu tiên</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
