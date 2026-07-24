import React, { useEffect, useState } from 'react';
import Hellotext from '@hellotext/hellotext';
import { useI18n } from '../i18n';

export default function SessionPanel({ addLog }) {
  const { t } = useI18n();
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
      <h2 className="panel__title">{t.session.title}</h2>
      <p className="panel__description">
        {t.session.description.split('{code}')[0]}
        <code>{t.session.sessionSetCode}</code>
        {t.session.description.split('{code}')[1]}
      </p>

      <div className="panel__section">
        <div className="panel__section-title">{t.session.currentSession}</div>
        <div className={`session-value ${!session ? 'session-value--empty' : ''}`}>
          {session || t.session.noSession}
        </div>
      </div>

      <div className="panel__section">
        <div className="panel__section-title">{t.session.howItWorks}</div>
        <div className="code-hint">
          <code>Hellotext.session</code> {t.session.apiSession}<br />
          <code>Hellotext.on('session-set', callback)</code> {t.session.apiOn}
        </div>
      </div>
    </div>
  );
}
