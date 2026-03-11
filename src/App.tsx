import React, { useState } from 'react';
import { DashboardShell } from './components/layout/DashboardShell';
import { Overview } from './components/dashboard/Overview';
import { GrowthSection } from './components/dashboard/GrowthSection';
import { RecruitmentSection } from './components/dashboard/RecruitmentSection';
import { PipelineSection } from './components/dashboard/PipelineSection';
import { AISection } from './components/dashboard/AISection';
import { IntegrationsSection } from './components/dashboard/IntegrationsSection';
import { EngagementSection } from './components/dashboard/EngagementSection';
import { JobBoardSection } from './components/dashboard/JobBoardSection';
import { Filters } from './components/dashboard/Filters';
import { Toaster } from 'sonner';

function App() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <Overview />;
      case 'growth': return <GrowthSection />;
      case 'recruitment': return <RecruitmentSection />;
      case 'pipeline': return <PipelineSection />;
      case 'ai': return <AISection />;
      case 'integrations': return <IntegrationsSection />;
      case 'engagement': return <EngagementSection />;
      case 'jobboard': return <JobBoardSection />;
      default: return <Overview />;
    }
  };

  return (
    <DashboardShell activeTab={activeTab} onTabChange={setActiveTab}>
      <Toaster position="top-right" expand={true} richColors />
      <div className="max-w-7xl mx-auto">
        <Filters 
          onWorkspaceChange={(val) => console.log('Workspace:', val)}
          onTimeRangeChange={(val) => console.log('Range:', val)}
        />
        {renderContent()}
      </div>
    </DashboardShell>
  );
}

export default App;