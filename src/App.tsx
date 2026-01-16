
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { Dashboard } from './features/dashboard/Dashboard';
import { Journal } from './features/journal/Journal';
import { Dating } from './features/dating/Dating';
import { ChallengeDashboard } from './features/challenge/ChallengeDashboard';
import { Investments } from './features/investments/Investments';
import { FitnessProgress } from './features/fitness/FitnessProgress';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="journal" element={<Journal />} />
          <Route path="challenge" element={<ChallengeDashboard />} />
          <Route path="dating" element={<Dating />} />
          <Route path="investments" element={<Investments />} />
          <Route path="fitness/progress" element={<FitnessProgress />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

