import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Target, Plus, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  showBack?: boolean;
  backTo?: string;
  backLabel?: string;
}

export const Header: React.FC<HeaderProps> = ({
  showBack = false,
  backTo = '/',
  backLabel = 'Quay lại',
}) => {
  const location = useLocation();
  const isCreatePage = location.pathname === '/goals/new';

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack ? (
            <Link
              to={backTo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{backLabel}</span>
            </Link>
          ) : (
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center shadow-sm shadow-teal-700/20 group-hover:bg-teal-800 transition-colors">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 leading-tight tracking-tight flex items-center gap-2">
                  My Goals
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200/60 hidden sm:inline-block">
                    Theo dõi hàng ngày
                  </span>
                </h1>
                <p className="text-xs text-slate-500 hidden sm:block">Xây dựng thói quen, chinh phục mục tiêu</p>
              </div>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          {!isCreatePage && (
            <Link
              to="/goals/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 text-white text-sm font-medium hover:bg-teal-800 shadow-sm shadow-teal-700/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Mục tiêu mới</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

