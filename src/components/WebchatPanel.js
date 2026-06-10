import React, { useEffect } from 'react';
import Hellotext from '@hellotext/hellotext';

const WEBCHAT_EVENTS = [
  'webchat:mounted',
  'webchat:opened',
  'webchat:closed',
  'webchat:message:sent',
  'webchat:message:received',
];

export default function WebchatPanel({ addLog, webchatId }) {
  useEffect(() => {
    const handlers = WEBCHAT_EVENTS.map((eventName) => {
      const handler = (data) => {
        addLog({
          name: eventName,
          status: 'info',
          payload: data,
        });
      };
      Hellotext.on(eventName, handler);
      return { eventName, handler };
    });

    return () => {
      handlers.forEach(({ eventName, handler }) => {
        try { Hellotext.removeEventListener(eventName, handler); } catch {}
      });
    };
  }, [addLog]);

  return (
    <div className="panel">
      <h2 className="panel__title">Webchat</h2>
      <p className="panel__description">
        The SDK automatically mounts webchat when configured.
        {webchatId
          ? <> Initialized with Webchat ID: <code>{webchatId}</code>.</>
          : <> Using dashboard-managed webchat settings (no override ID specified).</>
        }
      </p>

      <div className="panel__section">
        <div className="panel__section-title">Status</div>
        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
          If webchat is configured for your business, the widget should appear in the bottom-right corner of this page.
          Interact with it and watch events appear in the Event Log.
        </p>
      </div>

      <div className="panel__section">
        <div className="panel__section-title">Monitored Events</div>
        <div className="code-hint">
          {WEBCHAT_EVENTS.map((evt) => (
            <div key={evt}><code>{evt}</code></div>
          ))}
        </div>
      </div>

      <div className="panel__section">
        <div className="panel__section-title">Configuration</div>
        <div className="code-hint">
          <code>
            {webchatId
              ? `Hellotext.initialize(businessId, { webchat: { id: "${webchatId}" } })`
              : `Hellotext.initialize(businessId) // uses dashboard webchat settings`
            }
          </code>
        </div>
      </div>
    </div>
  );
}
