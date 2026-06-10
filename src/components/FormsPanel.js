import React, { useState, useEffect } from 'react';
import Hellotext from '@hellotext/hellotext';

export default function FormsPanel({ addLog }) {
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
      <h2 className="panel__title">Forms</h2>
      <p className="panel__description">
        The SDK discovers elements with <code>data-hello-form</code> attributes and mounts
        Hellotext forms into them. Enter a Form ID to test.
      </p>

      <div className="panel__section">
        <div className="panel__section-title">Mount a Form</div>
        <div className="inline-row">
          <div className="field">
            <label htmlFor="form-id">Form ID</label>
            <input
              id="form-id"
              type="text"
              value={formId}
              onChange={(e) => setFormId(e.target.value)}
              placeholder="e.g. aBcDeFgH"
            />
          </div>
          {!mountedFormId ? (
            <button
              className="btn btn--primary btn--small"
              onClick={handleMount}
              disabled={!formId.trim()}
              data-testid="mount-form-btn"
            >
              Mount Form
            </button>
          ) : (
            <button
              className="btn btn--danger btn--small"
              onClick={handleUnmount}
              data-testid="unmount-form-btn"
            >
              Unmount
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
          <span>Form will render here after mounting</span>
        )}
      </div>

      <div className="panel__section" style={{ marginTop: 'var(--space-md)' }}>
        <div className="panel__section-title">Events</div>
        <div className="code-hint">
          <code>forms:collected</code> → fires when forms are discovered on the page<br />
          <code>form:completed</code> → fires when a user completes a form and verifies OTP
        </div>
      </div>
    </div>
  );
}
