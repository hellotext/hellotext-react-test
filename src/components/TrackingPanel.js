import React, { useState } from 'react';
import Hellotext from '@hellotext/hellotext';
import { useI18n } from '../i18n';

const PRESET_EVENTS = [
  {
    name: 'product.viewed',
    params: { product_id: 'prod_demo_001', name: 'Demo Product', price: 29.99 },
  },
  {
    name: 'cart.added',
    params: { product_id: 'prod_demo_001', quantity: 1, price: 29.99 },
  },
  {
    name: 'checkout.started',
    params: { total: 29.99, currency: 'USD', items_count: 1 },
  },
];

export default function TrackingPanel({ addLog }) {
  const { t } = useI18n();
  const [customEvent, setCustomEvent] = useState('');
  const [customParams, setCustomParams] = useState('{}');
  const [sending, setSending] = useState(null);

  const fireEvent = async (eventName, params) => {
    setSending(eventName);
    addLog({
      name: `track: ${eventName}`,
      status: 'info',
      payload: { event: eventName, params },
    });

    try {
      const response = await Hellotext.track(eventName, params);
      addLog({
        name: `track: ${eventName}`,
        status: 'success',
        payload: response?.data || response,
      });
    } catch (error) {
      addLog({
        name: `track: ${eventName}`,
        status: 'error',
        payload: error?.message || String(error),
      });
    } finally {
      setSending(null);
    }
  };

  const handleCustomTrack = () => {
    const name = customEvent.trim();
    if (!name) return;

    let params;
    try {
      params = JSON.parse(customParams);
    } catch {
      addLog({
        name: 'custom track',
        status: 'error',
        payload: t.tracking.invalidJson,
      });
      return;
    }

    fireEvent(name, params);
  };

  return (
    <div className="panel">
      <h2 className="panel__title">{t.tracking.title}</h2>
      <p className="panel__description">
        {t.tracking.description.split('{code}')[0]}
        <code>{t.tracking.trackCode}</code>
        {t.tracking.description.split('{code}')[1]}
      </p>

      <div className="panel__section">
        <div className="panel__section-title">{t.tracking.presetEvents}</div>
        <div className="tracking-buttons">
          {PRESET_EVENTS.map((evt) => (
            <button
              key={evt.name}
              className="btn btn--secondary btn--small"
              onClick={() => fireEvent(evt.name, evt.params)}
              disabled={sending === evt.name}
              data-testid={`track-${evt.name}`}
            >
              {sending === evt.name ? t.tracking.sending : evt.name}
            </button>
          ))}
        </div>
      </div>

      <div className="panel__section">
        <div className="panel__section-title">{t.tracking.customEvent}</div>
        <div className="field">
          <label htmlFor="custom-event-name">{t.tracking.eventName}</label>
          <input
            id="custom-event-name"
            type="text"
            value={customEvent}
            onChange={(e) => setCustomEvent(e.target.value)}
            placeholder={t.tracking.eventNamePlaceholder}
          />
        </div>
        <div className="field">
          <label htmlFor="custom-event-params">
            {t.tracking.parameters} <span className="optional">{t.tracking.json}</span>
          </label>
          <textarea
            id="custom-event-params"
            value={customParams}
            onChange={(e) => setCustomParams(e.target.value)}
            placeholder='{"key": "value"}'
          />
        </div>
        <button
          className="btn btn--primary btn--small"
          onClick={handleCustomTrack}
          disabled={!customEvent.trim() || sending}
          data-testid="track-custom"
        >
          {t.tracking.fireCustom}
        </button>
      </div>
    </div>
  );
}
