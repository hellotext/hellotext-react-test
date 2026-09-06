import React, { useEffect, useState } from 'react';
import Hellotext from '@hellotext/hellotext';
import { useI18n } from '../i18n';

const SECTIONS = ['homepage', 'product_collection', 'product_details'];
const ALERT_EVENTS = ['alert:shown', 'alert:dismissed', 'alert:accepted'];

export default function SmartAlertPanel({ addLog }) {
  const { t } = useI18n();
  const [showing, setShowing] = useState(null);

  useEffect(() => {
    const handlers = ALERT_EVENTS.map((eventName) => {
      const handler = (data) => {
        addLog({ name: eventName, status: 'info', payload: data });
      };

      Hellotext.on(eventName, handler);
      return { eventName, handler };
    });

    return () => {
      handlers.forEach(({ eventName, handler }) => {
        Hellotext.removeEventListener(eventName, handler);
      });
    };
  }, [addLog]);

  const showSection = async (kind) => {
    setShowing(kind);
    addLog({
      name: 'Hellotext.alert.show',
      status: 'info',
      payload: { kind, options: { force: true } },
    });

    try {
      if (!Hellotext.alert) {
        addLog({
          name: 'Hellotext.alert.show',
          status: 'error',
          payload: { kind, message: t.smartAlert.unavailable },
        });
        return;
      }

      const shown = await Hellotext.alert.show(kind, { force: true });
      addLog({
        name: 'Hellotext.alert.show',
        status: shown ? 'success' : 'info',
        payload: shown ? { kind, shown } : { kind, shown, message: t.smartAlert.notShown },
      });
    } catch (error) {
      addLog({
        name: 'Hellotext.alert.show',
        status: 'error',
        payload: { kind, message: error?.message || String(error) },
      });
    } finally {
      setShowing(null);
    }
  };

  const hideAlert = () => {
    Hellotext.alert?.hide();
    addLog({ name: 'Hellotext.alert.hide', status: 'info' });
  };

  return (
    <div className="panel">
      <h2 className="panel__title">{t.smartAlert.title}</h2>
      <p className="panel__description">{t.smartAlert.description}</p>

      <div className="panel__section">
        <div className="panel__section-title">{t.smartAlert.sections}</div>
        <div className="tracking-buttons">
          {SECTIONS.map((kind) => (
            <button
              key={kind}
              type="button"
              className="btn btn--primary btn--small"
              onClick={() => showSection(kind)}
              disabled={showing !== null}
              data-testid={`alert-${kind}`}
            >
              {showing === kind ? t.smartAlert.showing : t.smartAlert.sectionLabels[kind]}
            </button>
          ))}
          <button
            type="button"
            className="btn btn--secondary btn--small"
            onClick={hideAlert}
            data-testid="alert-hide"
          >
            {t.smartAlert.hide}
          </button>
        </div>
      </div>

      <div className="panel__section">
        <div className="panel__section-title">{t.smartAlert.status}</div>
        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
          {t.smartAlert.statusDescription}
        </p>
      </div>

      <div className="panel__section">
        <div className="panel__section-title">{t.smartAlert.monitoredEvents}</div>
        <div className="code-hint">
          {ALERT_EVENTS.map((eventName) => (
            <div key={eventName}><code>{eventName}</code></div>
          ))}
        </div>
        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
          {t.smartAlert.acceptedHint}
        </p>
      </div>

      <div className="panel__section">
        <div className="panel__section-title">{t.smartAlert.usage}</div>
        <div className="code-hint">
          {SECTIONS.map((kind) => (
            <div key={kind}><code>{`await Hellotext.alert.show('${kind}', { force: true })`}</code></div>
          ))}
          <div><code>Hellotext.alert.hide()</code></div>
        </div>
      </div>
    </div>
  );
}
