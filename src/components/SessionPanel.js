import React, { useEffect, useState } from 'react';
import Hellotext from '@hellotext/hellotext';

export default function SessionPanel({ addLog }) {
  const [session, setSession] = useState(Hellotext.session || null);

  useEffect(() => {
    const handler = (newSession) => {
      setSession(newSession);
      addLog({
        name: 'session-set',
        status: 'info',
        payload: newSession,
      });
    };

    Hellotext.on('session-set', handler);
    return () => {
      try { Hellotext.removeEventListener('session-set', handler); } catch {}
    };
  }, [addLog]);

  return (
    <div className="panel">
      <h2 className="panel__title">Session</h2>
      <p className="panel__description">
        The SDK assigns a session token when initialized. It is stored in cookies and reused across page loads.
        The <code>session-set</code> event fires when the session is set or loaded.
      </p>

      <div className="panel__section">
        <div className="panel__section-title">Current Session</div>
        <div className={`session-value ${!session ? 'session-value--empty' : ''}`}>
          {session || 'No session yet — waiting for session-set event…'}
        </div>
      </div>

      <div className="panel__section">
        <div className="panel__section-title">How it works</div>
        <div className="code-hint">
          <code>Hellotext.session</code> → returns the current session token<br />
          <code>Hellotext.on('session-set', callback)</code> → fires when session is assigned
        </div>
      </div>
    </div>
  );
}
