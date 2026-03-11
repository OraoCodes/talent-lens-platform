import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardShell } from './components/layout/DashboardShell';
import { Overview } from './components/dashboard/Overview';
import { GrowthSection } from './components/dashboard/GrowthSection';
import { EngagementSection } from './components/dashboard/EngagementSection';
import { WorkspacesList } from './components/workspaces/WorkspacesList';
import { WorkspaceDetails } from './components/workspaces/WorkspaceDetails';
import { Toaster } from 'sonner';

function App() {
  return (
    <BrowserRouter>
      <DashboardShell>
        <Toaster position="top-right" expand={true} richColors />
        <div className="max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/overview" replace />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/workspaces" element={<WorkspacesList />} />
            <Route path="/workspaces/:workspaceId" element={<WorkspaceDetails />} />
            <Route path="/growth" element={<GrowthSection />} />
            <Route path="/engagement" element={<EngagementSection />} />
          </Routes>
        </div>
      </DashboardShell>
    </BrowserRouter>
  );
}

export default App;