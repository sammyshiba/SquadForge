import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { SquadProvider } from './context/SquadContext';
import { AppShell } from './components/AppShell';
import { DemandCenter } from './pages/DemandCenter';
import { CandidateList } from './pages/CandidateList';
import { SquadSummary } from './pages/SquadSummary';
import { Analytics } from './pages/Analytics';
import { TeamConfig } from './pages/TeamConfig';

export const App = (): JSX.Element => {
  return (
    <BrowserRouter>
      <SquadProvider>
        <AppShell>
          <Routes>
            <Route path="/" element={<DemandCenter />} />
            <Route path="/candidates" element={<CandidateList />} />
            <Route path="/squad-summary" element={<SquadSummary />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/team-config" element={<TeamConfig />} />
          </Routes>
        </AppShell>
      </SquadProvider>
    </BrowserRouter>
  );
};
