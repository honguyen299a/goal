import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, AlertCircle } from 'lucide-react';
import { Goal, GoalFormData } from '../../types/goal';
import { getTodayString, isBefore } from '../../utils/dateUtils';

interface GoalFormProps {
  initialData?: Goal | null;
  onSubmit: (data: GoalFormData) => void;
  isEditing?: boolean;
}

const PRESET_COLORS = [
  { name: 'Teal (Chủ đạo)', value: '#0F766E' },
  { name: 'Xanh dương', value: '#0284C7' },
  { name: 'Xanh lá', value: '#16A34A' },
  { name: 'Tím Indigo', value: '#4F46E5' },
  { name: 'Cam Amber', value: '#D97706' },
  { name: 'Đỏ Hồng', value: '#E11D48' },
];

export const GoalForm: React.FC<GoalFormProps> = ({
  initialData,
  onSubmit,
  isEditing = false,
}) => {
  const navigate = useNavigate();
  const today = getTodayString();

  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [startDate, setStartDate] = useState(initialData?.startDate || today);
  const [hasEndDate, setHasEndDate] = useState(Boolean(initialData?.endDate));
  const [endDate, setEndDate] = useState(initialData?.endDate || '');
  const [color, setColor] = useState(initialData?.color || '#0F766E');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Vui lòng nhập tên mục tiêu.';
    }

    if (!startDate) {
      newErrors.startDate = 'Vui lòng chọn ngày bắt đầu.';
    }

    if (hasEndDate && endDate) {
      if (isBefore(endDate, startDate)) {
        newErrors.endDate = 'Ngày kết thúc không thể trước ngày bắt đầu.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      startDate,
      endDate: hasEndDate && endDate ? endDate : null,
      color,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="goal-title" className="block text-sm font-semibold text-slate-800 mb-2">
          Tên mục tiêu <span className="text-red-500">*</span>
        </label>
        <input
          id="goal-title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
          }}
          placeholder="Ví dụ: Đọc sách 30 phút mỗi ngày, Học IELTS 7.5..."
          className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
            errors.title
              ? 'border-red-400 focus:ring-red-200'
              : 'border-slate-200 focus:border-teal-600 focus:ring-teal-100'
          }`}
        />
        {errors.title && (
          <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.title}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="goal-desc" className="block text-sm font-semibold text-slate-800 mb-2">
          Mô tả mục tiêu
        </label>
        <textarea
          id="goal-desc"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ghi chú thêm về lý do, kế hoạch hoặc chi tiết thực hiện..."
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition-all resize-none"
        />
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
        {/* Start Date */}
        <div>
          <label htmlFor="start-date" className="block text-sm font-semibold text-slate-800 mb-2">
            Ngày bắt đầu <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                if (errors.startDate) setErrors((prev) => ({ ...prev, startDate: '' }));
              }}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                errors.startDate
                  ? 'border-red-400 focus:ring-red-200'
                  : 'border-slate-200 focus:border-teal-600 focus:ring-teal-100'
              }`}
            />
          </div>
          {errors.startDate && (
            <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.startDate}
            </p>
          )}
        </div>

        {/* End Date Option */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="end-date" className="text-sm font-semibold text-slate-800">
              Ngày kết thúc
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
              <input
                type="checkbox"
                checked={hasEndDate}
                onChange={(e) => {
                  setHasEndDate(e.target.checked);
                  if (!e.target.checked) setEndDate('');
                }}
                className="w-4 h-4 text-teal-700 rounded border-slate-300 focus:ring-teal-500"
              />
              <span>Đặt thời hạn</span>
            </label>
          </div>

          <div className="relative">
            <input
              id="end-date"
              type="date"
              disabled={!hasEndDate}
              value={endDate}
              min={startDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                if (errors.endDate) setErrors((prev) => ({ ...prev, endDate: '' }));
              }}
              placeholder="Chọn ngày kết thúc"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                !hasEndDate
                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                  : errors.endDate
                  ? 'border-red-400 focus:ring-red-200'
                  : 'border-slate-200 focus:border-teal-600 focus:ring-teal-100'
              }`}
            />
          </div>
          {errors.endDate && (
            <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.endDate}
            </p>
          )}
          {!hasEndDate && (
            <p className="mt-1.5 text-xs text-slate-400">
              Không giới hạn: Bạn có thể duy trì thói quen này liên tục.
            </p>
          )}
        </div>
      </div>

      {/* Color theme selection */}
      <div>
        <label className="block text-sm font-semibold text-slate-800 mb-2.5">
          Màu nhận diện mục tiêu
        </label>
        <div className="flex flex-wrap items-center gap-3">
          {PRESET_COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setColor(c.value)}
              className="group relative flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all"
              style={{
                borderColor: color === c.value ? c.value : '#E2E8F0',
                backgroundColor: color === c.value ? `${c.value}10` : '#FFFFFF',
              }}
            >
              <span
                className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: c.value }}
              >
                {color === c.value && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
              </span>
              <span className="text-xs font-medium text-slate-700">{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
        >
          Hủy bỏ
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-teal-700 text-white text-sm font-medium hover:bg-teal-800 shadow-sm shadow-teal-700/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {isEditing ? 'Cập nhật mục tiêu' : 'Tạo mục tiêu'}
        </button>
      </div>
    </form>
  );
};
