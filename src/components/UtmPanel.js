import React, { useEffect, useState } from 'react';
import Hellotext from '@hellotext/hellotext';

export default function UtmPanel({ addLog }) {
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
      <h2 className="panel__title">UTM Capture</h2>
      <p className="panel__description">
        The SDK automatically captures UTM parameters from the URL and fires the <code>utm-set</code> event.
        Add UTM params to the URL and reload to test.
      </p>

      <div className="panel__section">
        <div className="panel__section-title">Test URL</div>
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
          Open with UTM params
        </button>
      </div>

      <div className="panel__section">
        <div className="panel__section-title">Captured UTM Data</div>
        {utmData ? (
          <table className="utm-table">
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Value</th>
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
            No UTM data captured yet — add UTM params to the URL and reload.
          </div>
        )}
      </div>
    </div>
  );
}
