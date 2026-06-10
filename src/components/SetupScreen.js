import React, { useState } from 'react';

const STORAGE_KEY_BIZ = 'ht_business_id';
const STORAGE_KEY_WEBCHAT = 'ht_webchat_id';

export default function SetupScreen({ onInitialize }) {
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
        <div className="setup-card__logo">Hellotext</div>
        <p className="setup-card__subtitle">
          SDK Integration Playground — enter your Business ID to get started.
        </p>

        <div className="field">
          <label htmlFor="business-id">Business ID</label>
          <input
            id="business-id"
            type="text"
            value={businessId}
            onChange={(e) => setBusinessId(e.target.value)}
            placeholder="e.g. aBcDeFgH"
            autoFocus
          />
          <div className="hint">
            Find this in your Hellotext dashboard → Settings → Business.
          </div>
        </div>

        <div className="field">
          <label htmlFor="webchat-id">
            Webchat ID <span className="optional">(optional)</span>
          </label>
          <input
            id="webchat-id"
            type="text"
            value={webchatId}
            onChange={(e) => setWebchatId(e.target.value)}
            placeholder="Leave empty to use dashboard defaults"
          />
          <div className="hint">
            Override the webchat configuration. If empty, the SDK uses your dashboard webchat settings.
          </div>
        </div>

        <button
          type="submit"
          className="btn btn--primary btn--full"
          disabled={!businessId.trim()}
          data-testid="initialize-btn"
        >
          Initialize SDK
        </button>
      </form>
    </div>
  );
}
