import React, { useState, useCallback } from 'react';
import Hellotext from '@hellotext/hellotext';
import SetupScreen from './components/SetupScreen';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [initialized, setInitialized] = useState(false);
  const [businessId, setBusinessId] = useState('');
  const [webchatId, setWebchatId] = useState(null);
  const [activeTab, setActiveTab] = useState('session');
  const [logs, setLogs] = useState([]);

  const addLog = useCallback((entry) => {
    setLogs((prev) => [
      ...prev,
      { ...entry, timestamp: Date.now() },
    ]);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  const handleInitialize = useCallback((bizId, chatId) => {
    const config = {};
    if (chatId) {
      config.webchat = { id: chatId };
    }

    try {
      Hellotext.initialize(bizId, config);
      setBusinessId(bizId);
      setWebchatId(chatId);
      setInitialized(true);
      setLogs([{
        name: 'Hellotext.initialize',
        status: 'success',
        payload: { businessId: bizId, webchatId: chatId },
        timestamp: Date.now(),
      }]);
    } catch (error) {
      setLogs([{
        name: 'Hellotext.initialize',
        status: 'error',
        payload: error?.message || String(error),
        timestamp: Date.now(),
      }]);
    }
  }, []);

  const handleReset = useCallback(() => {
    localStorage.removeItem('ht_business_id');
    localStorage.removeItem('ht_webchat_id');
    window.location.reload();
  }, []);

  if (!initialized) {
    return <SetupScreen onInitialize={handleInitialize} />;
  }

  return (
    <Dashboard
      businessId={businessId}
      webchatId={webchatId}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      logs={logs}
      addLog={addLog}
      onClearLogs={clearLogs}
      onReset={handleReset}
    />
  );
}

export default App;
