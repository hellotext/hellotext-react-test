import React, { useEffect, useState } from 'react';
import Hellotext from '@hellotext/hellotext';
import { useI18n } from '../i18n';

export default function UtmPanel({ addLog }) {
  const { t } = useI18n();
  const [utmData, setUtmData] = useState(null);

  useEffect(() => {
    const handler = (utm) => {
      setUtmData(utm);
      addLog({
        name: 'utm-set',
        status: 'info',
        payload: utm,
      });
    };

    Hellotext.on('utm-set', handler);
    return () => {
      try { Hellotext.removeEventListener('utm-set', handler); } catch {}
    };
  }, [addLog]);

  const utmParams = 'utm_source=test&utm_medium=playground&utm_campaign=demo&utm_term=sdk&utm_content=v1';
  const currentUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';

  return (
    <div className="panel">
      <h2 className="panel__title">{t.utm.title}</h2>
      <p className="panel__description">
        {t.utm.description.split('{code}')[0]}
        <code>{t.utm.utmSetCode}</code>
        {t.utm.description.split('{code}')[1]}
      </p>

      <div className="panel__section">
        <div className="panel__section-title">{t.utm.testUrl}</div>
        <div className="code-hint">
          <code>{currentUrl}?{utmParams}</code>
        </div>
        <button
          className="btn btn--secondary btn--small"
          onClick={() => {
            const url = `${currentUrl}?${utmParams}`;
            window.location.href = url;
          }}
        >
          {t.utm.openWithUtm}
        </button>
      </div>

      <div className="panel__section">
        <div className="panel__section-title">{t.utm.capturedData}</div>
        {utmData ? (
          <table className="utm-table">
            <thead>
              <tr>
                <th>{t.utm.parameterCol}</th>
                <th>{t.utm.valueCol}</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(utmData).map(([key, value]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{String(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="session-value session-value--empty">
            {t.utm.noData}
          </div>
        )}
      </div>
    </div>
  );
}
