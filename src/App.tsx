import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoalListPage } from './pages/GoalListPage';
import { GoalDetailPage } from './pages/GoalDetailPage';
import { GoalFormPage } from './pages/GoalFormPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GoalListPage />} />
        <Route path="/goals/new" element={<GoalFormPage />} />
        <Route path="/goals/:id" element={<GoalDetailPage />} />
        <Route path="/goals/:id/edit" element={<GoalFormPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
