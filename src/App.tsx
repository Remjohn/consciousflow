
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { Dashboard } from './features/dashboard/Dashboard';
import { StatsDashboard } from './features/stats/StatsDashboard';
import { FinanceTracker } from './features/finance/FinanceTracker';
import { FitnessProgress } from './features/fitness/FitnessProgress';
import { ChallengeDashboard } from './features/challenge/ChallengeDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="stats" element={<StatsDashboard />} />
          <Route path="finance" element={<FinanceTracker />} />
          <Route path="investments" element={<Navigate to="/finance" replace />} />
          <Route path="challenge" element={<ChallengeDashboard />} />
          <Route path="fitness/progress" element={<FitnessProgress />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

