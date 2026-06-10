import React from 'react';
import HellotextLogo from './HellotextLogo';
import SessionPanel from './SessionPanel';
import UtmPanel from './UtmPanel';
import TrackingPanel from './TrackingPanel';
import FormsPanel from './FormsPanel';
import WebchatPanel from './WebchatPanel';
import EventLog from './EventLog';

const TABS = [
  { id: 'session', label: 'Session' },
  { id: 'utm', label: 'UTM' },
  { id: 'tracking', label: 'Tracking' },
  { id: 'forms', label: 'Forms' },
  { id: 'webchat', label: 'Webchat' },
];

export default function Dashboard({
  businessId,
  webchatId,
  activeTab,
  onTabChange,
  logs,
  addLog,
  onClearLogs,
  onReset,
}) {
  const renderPanel = () => {
    switch (activeTab) {
      case 'session':
        return <SessionPanel addLog={addLog} />;
      case 'utm':
        return <UtmPanel addLog={addLog} />;
      case 'tracking':
        return <TrackingPanel addLog={addLog} />;
      case 'forms':
        return <FormsPanel addLog={addLog} />;
      case 'webchat':
        return <WebchatPanel addLog={addLog} webchatId={webchatId} />;
      default:
        return <SessionPanel addLog={addLog} />;
    }
  };

  return (
    <div className="dashboard" data-testid="dashboard">
      <header className="dashboard__header">
        <div className="dashboard__header-left">
          <HellotextLogo width={120} height={34} className="dashboard__logo" />
          <span className="dashboard__badge">{businessId}</span>
        </div>
        <button
          className="btn btn--secondary btn--small"
          onClick={onReset}
          data-testid="reset-btn"
        >
          Reset
        </button>
      </header>

      <div className="dashboard__body">
        <div className="dashboard__main">
          <nav className="tabs" data-testid="tab-navigation">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={`tab ${activeTab === tab.id ? 'tab--active' : ''}`}
                onClick={() => onTabChange(tab.id)}
                data-testid={`tab-${tab.id}`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {renderPanel()}
        </div>

        <div className="dashboard__log">
          <EventLog logs={logs} onClear={onClearLogs} />
        </div>
      </div>
    </div>
  );
}
