import React, { useState, useEffect } from 'react';
import Hellotext from '@hellotext/hellotext';
import { useI18n } from '../i18n';

export default function FormsPanel({ addLog }) {
  const { t } = useI18n();
  const [formId, setFormId] = useState('');
  const [mountedFormId, setMountedFormId] = useState(null);

  useEffect(() => {
    const onCollected = (forms) => {
      addLog({
        name: 'forms:collected',
        status: 'info',
        payload: { count: Array.isArray(forms) ? forms.length : forms },
      });
    };

    const onCompleted = (form) => {
      addLog({
        name: 'form:completed',
        status: 'success',
        payload: form,
      });
    };

    Hellotext.on('forms:collected', onCollected);
    Hellotext.on('form:completed', onCompleted);

    return () => {
      try { Hellotext.removeEventListener('forms:collected', onCollected); } catch {}
      try { Hellotext.removeEventListener('form:completed', onCompleted); } catch {}
    };
  }, [addLog]);

  const handleMount = () => {
    const id = formId.trim();
    if (!id) return;
    setMountedFormId(id);
    addLog({
      name: 'form:mount',
      status: 'info',
      payload: { formId: id },
    });
  };

  const handleUnmount = () => {
    setMountedFormId(null);
    addLog({
      name: 'form:unmount',
      status: 'info',
      payload: null,
    });
  };

  return (
    <div className="panel">
      <h2 className="panel__title">{t.forms.title}</h2>
      <p className="panel__description">
        {t.forms.description.split('{code}')[0]}
        <code>{t.forms.dataHelloForm}</code>
        {t.forms.description.split('{code}')[1]}
      </p>

      <div className="panel__section">
        <div className="panel__section-title">{t.forms.mountForm}</div>
        <div className="inline-row">
          <div className="field">
            <label htmlFor="form-id">{t.forms.formId}</label>
            <input
              id="form-id"
              type="text"
              value={formId}
              onChange={(e) => setFormId(e.target.value)}
              placeholder={t.forms.formIdPlaceholder}
            />
          </div>
          {!mountedFormId ? (
            <button
              className="btn btn--primary btn--small"
              onClick={handleMount}
              disabled={!formId.trim()}
              data-testid="mount-form-btn"
            >
              {t.forms.mountBtn}
            </button>
          ) : (
            <button
              className="btn btn--danger btn--small"
              onClick={handleUnmount}
              data-testid="unmount-form-btn"
            >
              {t.forms.unmountBtn}
            </button>
          )}
        </div>
      </div>

      <div className={`form-mount-area ${mountedFormId ? 'form-mount-area--active' : ''}`}>
        {mountedFormId ? (
          <div data-hello-form={mountedFormId} data-testid="hello-form-container" style={{ width: '100%' }}>
            {/* The SDK will discover and mount the form here */}
          </div>
        ) : (
          <span>{t.forms.placeholder}</span>
        )}
      </div>

      <div className="panel__section" style={{ marginTop: 'var(--space-md)' }}>
        <div className="panel__section-title">{t.forms.events}</div>
        <div className="code-hint">
          <code>forms:collected</code> {t.forms.formsCollectedHint}<br />
          <code>form:completed</code> {t.forms.formCompletedHint}
        </div>
      </div>
    </div>
  );
}
