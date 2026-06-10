import React, { useState } from 'react';
import Hellotext from '@hellotext/hellotext';

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
        payload: 'Invalid JSON in params field',
      });
      return;
    }

    fireEvent(name, params);
  };

  return (
    <div className="panel">
      <h2 className="panel__title">Tracking Events</h2>
      <p className="panel__description">
        Fire tracking events using <code>Hellotext.track(eventName, params)</code>.
        Click a preset button or enter a custom event below.
      </p>

      <div className="panel__section">
        <div className="panel__section-title">Preset Events</div>
        <div className="tracking-buttons">
          {PRESET_EVENTS.map((evt) => (
            <button
              key={evt.name}
              className="btn btn--secondary btn--small"
              onClick={() => fireEvent(evt.name, evt.params)}
              disabled={sending === evt.name}
              data-testid={`track-${evt.name}`}
            >
              {sending === evt.name ? 'Sending…' : evt.name}
            </button>
          ))}
        </div>
      </div>

      <div className="panel__section">
        <div className="panel__section-title">Custom Event</div>
        <div className="field">
          <label htmlFor="custom-event-name">Event Name</label>
          <input
            id="custom-event-name"
            type="text"
            value={customEvent}
            onChange={(e) => setCustomEvent(e.target.value)}
            placeholder="e.g. page.viewed"
          />
        </div>
        <div className="field">
          <label htmlFor="custom-event-params">
            Parameters <span className="optional">(JSON)</span>
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
          Fire Custom Event
        </button>
      </div>
    </div>
  );
}
