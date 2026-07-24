import React, { useRef, useEffect } from 'react';
import { useI18n } from '../i18n';

export default function EventLog({ logs, onClear }) {
  const { t } = useI18n();
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [logs]);

  const formatTime = (ts) => {
    const d = new Date(ts);
    return d.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }) + '.' + String(d.getMilliseconds()).padStart(3, '0');
  };

  const formatPayload = (payload) => {
    if (payload === undefined || payload === null) return null;
    try {
      return typeof payload === 'string'
        ? payload
        : JSON.stringify(payload, null, 2);
    } catch {
      return String(payload);
    }
  };

  return (
    <div className="event-log" data-testid="event-log">
      <div className="event-log__header">
        <div>
          <span className="event-log__title">{t.eventLog.title}</span>{' '}
          <span className="event-log__count">({logs.length})</span>
        </div>
        <button
          className="btn btn--small btn--danger"
          onClick={onClear}
          data-testid="clear-log-btn"
        >
          {t.eventLog.clear}
        </button>
      </div>

      <div className="event-log__body" ref={bodyRef}>
        {logs.length === 0 ? (
          <div className="event-log__empty">
            {t.eventLog.empty}
          </div>
        ) : (
          logs.map((entry, i) => (
            <div className="log-entry" key={i}>
              <div className="log-entry__header">
                <span>
                  <span className={`log-entry__status log-entry__status--${entry.status}`}>
                    {entry.status}
                  </span>
                  <span className="log-entry__name">{entry.name}</span>
                </span>
                <span className="log-entry__time">{formatTime(entry.timestamp)}</span>
              </div>
              {entry.payload !== undefined && entry.payload !== null && (
                <div className="log-entry__payload">
                  {formatPayload(entry.payload)}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
