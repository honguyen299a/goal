import { useState, useEffect, useCallback } from 'react';
import { Goal } from '../types/goal';
import {
  getStoredGoals,
  deleteStoredGoal,
  initializeSampleDataIfEmpty,
} from '../services/storage';

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadGoals = useCallback(() => {
    initializeSampleDataIfEmpty();
    const data = getStoredGoals();
    setGoals(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  const removeGoal = useCallback((goalId: string) => {
    deleteStoredGoal(goalId);
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
  }, []);

  return {
    goals,
    loading,
    refreshGoals: loadGoals,
    deleteGoal: removeGoal,
  };
}

