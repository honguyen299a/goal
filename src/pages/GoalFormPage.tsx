import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { GoalForm } from '../components/goal/GoalForm';
import { GoalFormData } from '../types/goal';
import { getStoredGoalById, saveStoredGoal } from '../services/storage';

export const GoalFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const goal = id ? getStoredGoalById(id) : null;

  const handleSubmit = (data: GoalFormData) => {
    const savedGoal = saveStoredGoal(data, id);
    if (isEditing) {
      navigate(`/goals/${savedGoal.id}`);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      <Header showBack backTo={id ? `/goals/${id}` : '/'} backLabel="Hủy và quay lại" />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {isEditing ? 'Chỉnh sửa mục tiêu' : 'Tạo mục tiêu mới'}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {isEditing
              ? 'Cập nhật lại tên, mô tả hoặc thời hạn cho mục tiêu của bạn.'
              : 'Thiết lập mục tiêu và thời gian để bắt đầu theo dõi tiến độ mỗi ngày.'}
          </p>
        </div>

        <GoalForm initialData={goal} onSubmit={handleSubmit} isEditing={isEditing} />
      </main>
    </div>
  );
};

