import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { Dashboard } from './features/dashboard/Dashboard';
import { FinanceTracker } from './features/finance/FinanceTracker';
import { StudioOperations } from './features/studio/StudioOperations';
import { OperatorReadiness } from './features/operator/OperatorReadiness';
import { ChallengeDashboard } from './features/challenge/ChallengeDashboard';
import { Dating } from './features/dating/Dating';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="today" element={<Navigate to="/dashboard" replace />} />
          <Route path="revenue" element={<FinanceTracker />} />
          <Route path="finance" element={<FinanceTracker />} />
          <Route path="investments" element={<Navigate to="/revenue" replace />} />
          <Route path="studio" element={<StudioOperations />} />
          <Route path="operator" element={<OperatorReadiness />} />
          <Route path="challenge" element={<ChallengeDashboard />} />
          <Route path="challenges" element={<ChallengeDashboard />} />
          <Route path="dating" element={<Dating />} />
          <Route path="championship" element={<Dating />} />
          <Route path="champion" element={<Navigate to="/dating" replace />} />
          <Route path="stats" element={<Navigate to="/studio" replace />} />
          <Route path="fitness/progress" element={<Navigate to="/operator" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
