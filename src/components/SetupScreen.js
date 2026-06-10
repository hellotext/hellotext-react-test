import React, { useState } from 'react';
import HellotextLogo from './HellotextLogo';
import { useI18n } from '../i18n';

const STORAGE_KEY_BIZ = 'ht_business_id';
const STORAGE_KEY_WEBCHAT = 'ht_webchat_id';

export default function SetupScreen({ onInitialize }) {
  const { t } = useI18n();

  const [businessId, setBusinessId] = useState(
    () => localStorage.getItem(STORAGE_KEY_BIZ) || ''
  );
  const [webchatId, setWebchatId] = useState(
    () => localStorage.getItem(STORAGE_KEY_WEBCHAT) || ''
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedBiz = businessId.trim();
    if (!trimmedBiz) return;

    localStorage.setItem(STORAGE_KEY_BIZ, trimmedBiz);
    if (webchatId.trim()) {
      localStorage.setItem(STORAGE_KEY_WEBCHAT, webchatId.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY_WEBCHAT);
    }

    onInitialize(trimmedBiz, webchatId.trim() || null);
  };

  return (
    <div className="setup-screen">
      <form className="setup-card" onSubmit={handleSubmit} data-testid="setup-form">
        <div className="setup-card__logo">
          <HellotextLogo width={180} height={52} />
        </div>
        <p className="setup-card__subtitle">
          {t.setup.subtitle}
        </p>

        <div className="field">
          <label htmlFor="business-id">{t.setup.businessId}</label>
          <input
            id="business-id"
            type="text"
            value={businessId}
            onChange={(e) => setBusinessId(e.target.value)}
            placeholder={t.setup.businessIdPlaceholder}
            autoFocus
          />
          <div className="hint">
            {t.setup.businessIdHint}
          </div>
        </div>

        <div className="field">
          <label htmlFor="webchat-id">
            {t.setup.webchatId} <span className="optional">{t.setup.optional}</span>
          </label>
          <input
            id="webchat-id"
            type="text"
            value={webchatId}
            onChange={(e) => setWebchatId(e.target.value)}
            placeholder={t.setup.webchatIdPlaceholder}
          />
          <div className="hint">
            {t.setup.webchatIdHint}
          </div>
        </div>

        <button
          type="submit"
          className="btn btn--primary btn--full"
          disabled={!businessId.trim()}
          data-testid="initialize-btn"
        >
          {t.setup.initializeBtn}
        </button>
      </form>
    </div>
  );
}
