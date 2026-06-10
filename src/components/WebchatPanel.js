import React, { useEffect } from 'react';
import Hellotext from '@hellotext/hellotext';
import { useI18n } from '../i18n';

const WEBCHAT_EVENTS = [
  'webchat:mounted',
  'webchat:opened',
  'webchat:closed',
  'webchat:message:sent',
  'webchat:message:received',
];

export default function WebchatPanel({ addLog, webchatId }) {
  const { t } = useI18n();
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
      <h2 className="panel__title">{t.webchat.title}</h2>
      <p className="panel__description">
        {t.webchat.descriptionDefault}
        {webchatId
          ? <> {t.webchat.withId.replace('{id}', '')}<code>{webchatId}</code>.</>
          : <> {t.webchat.withoutId}</>
        }
      </p>

      <div className="panel__section">
        <div className="panel__section-title">{t.webchat.status}</div>
        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
          {t.webchat.statusDescription}
        </p>
      </div>

      <div className="panel__section">
        <div className="panel__section-title">{t.webchat.monitoredEvents}</div>
        <div className="code-hint">
          {WEBCHAT_EVENTS.map((evt) => (
            <div key={evt}><code>{evt}</code></div>
          ))}
        </div>
      </div>

      <div className="panel__section">
        <div className="panel__section-title">{t.webchat.configuration}</div>
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
