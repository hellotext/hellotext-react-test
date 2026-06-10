import React, { createContext, useContext, useMemo } from 'react';

/**
 * Detect the user's preferred language from the browser.
 * Supports 'en' and 'es', defaults to 'en'.
 */
export function detectLanguage() {
  const stored = localStorage.getItem('ht_language');
  if (stored === 'en' || stored === 'es') return stored;

  const nav = navigator.language || navigator.userLanguage || 'en';
  return nav.startsWith('es') ? 'es' : 'en';
}

const translations = {
  en: {
    // --- Setup Screen ---
    setup: {
      subtitle: 'SDK Integration Playground — enter your Business ID to get started.',
      businessId: 'Business ID',
      businessIdPlaceholder: 'e.g. aBcDeFgH',
      businessIdHint: 'Find this in your Hellotext dashboard → Settings → Business.',
      webchatId: 'Webchat ID',
      optional: '(optional)',
      webchatIdPlaceholder: 'Leave empty to use dashboard defaults',
      webchatIdHint: 'Override the webchat configuration. If empty, the SDK uses your dashboard webchat settings.',
      initializeBtn: 'Initialize SDK',
    },

    // --- Dashboard ---
    dashboard: {
      reset: 'Reset',
      tabs: {
        session: 'Session',
        utm: 'UTM',
        tracking: 'Tracking',
        forms: 'Forms',
        webchat: 'Webchat',
      },
    },

    // --- Session Panel ---
    session: {
      title: 'Session',
      description: 'The SDK assigns a session token when initialized. It is stored in cookies and reused across page loads. The {code} event fires when the session is set or loaded.',
      sessionSetCode: 'session-set',
      currentSession: 'Current Session',
      noSession: 'No session yet — waiting for session-set event…',
      howItWorks: 'How it works',
      apiSession: '→ returns the current session token',
      apiOn: '→ fires when session is assigned',
    },

    // --- UTM Panel ---
    utm: {
      title: 'UTM Capture',
      description: 'The SDK automatically captures UTM parameters from the URL and fires the {code} event. Add UTM params to the URL and reload to test.',
      utmSetCode: 'utm-set',
      testUrl: 'Test URL',
      openWithUtm: 'Open with UTM params',
      capturedData: 'Captured UTM Data',
      parameterCol: 'Parameter',
      valueCol: 'Value',
      noData: 'No UTM data captured yet — add UTM params to the URL and reload.',
    },

    // --- Tracking Panel ---
    tracking: {
      title: 'Tracking Events',
      description: 'Fire tracking events using {code}. Click a preset button or enter a custom event below.',
      trackCode: 'Hellotext.track(eventName, params)',
      presetEvents: 'Preset Events',
      sending: 'Sending…',
      customEvent: 'Custom Event',
      eventName: 'Event Name',
      eventNamePlaceholder: 'e.g. page.viewed',
      parameters: 'Parameters',
      json: '(JSON)',
      fireCustom: 'Fire Custom Event',
      invalidJson: 'Invalid JSON in params field',
    },

    // --- Forms Panel ---
    forms: {
      title: 'Forms',
      description: 'The SDK discovers elements with {code} attributes and mounts Hellotext forms into them. Enter a Form ID to test.',
      dataHelloForm: 'data-hello-form',
      mountForm: 'Mount a Form',
      formId: 'Form ID',
      formIdPlaceholder: 'e.g. aBcDeFgH',
      mountBtn: 'Mount Form',
      unmountBtn: 'Unmount',
      placeholder: 'Form will render here after mounting',
      events: 'Events',
      formsCollectedHint: '→ fires when forms are discovered on the page',
      formCompletedHint: '→ fires when a user completes a form and verifies OTP',
    },

    // --- Webchat Panel ---
    webchat: {
      title: 'Webchat',
      descriptionDefault: 'The SDK automatically mounts webchat when configured.',
      withId: 'Initialized with Webchat ID: {id}.',
      withoutId: 'Using dashboard-managed webchat settings (no override ID specified).',
      status: 'Status',
      statusDescription: 'If webchat is configured for your business, the widget should appear in the bottom-right corner of this page. Interact with it and watch events appear in the Event Log.',
      monitoredEvents: 'Monitored Events',
      configuration: 'Configuration',
    },

    // --- Event Log ---
    eventLog: {
      title: 'Event Log',
      clear: 'Clear',
      empty: 'Events will appear here…',
    },

    // --- Common ---
    common: {
      language: 'Language',
    },
  },

  es: {
    // --- Pantalla de Configuración ---
    setup: {
      subtitle: 'Playground de Integración SDK — ingresa tu Business ID para comenzar.',
      businessId: 'Business ID',
      businessIdPlaceholder: 'ej. aBcDeFgH',
      businessIdHint: 'Encuéntralo en tu panel de Hellotext → Configuración → Negocio.',
      webchatId: 'Webchat ID',
      optional: '(opcional)',
      webchatIdPlaceholder: 'Dejar vacío para usar la configuración del panel',
      webchatIdHint: 'Sobreescribe la configuración del webchat. Si está vacío, el SDK usa la configuración de tu panel.',
      initializeBtn: 'Inicializar SDK',
    },

    // --- Panel Principal ---
    dashboard: {
      reset: 'Reiniciar',
      tabs: {
        session: 'Sesión',
        utm: 'UTM',
        tracking: 'Seguimiento',
        forms: 'Formularios',
        webchat: 'Webchat',
      },
    },

    // --- Panel de Sesión ---
    session: {
      title: 'Sesión',
      description: 'El SDK asigna un token de sesión al inicializarse. Se almacena en cookies y se reutiliza entre cargas de página. El evento {code} se dispara cuando la sesión se establece o carga.',
      sessionSetCode: 'session-set',
      currentSession: 'Sesión Actual',
      noSession: 'Sin sesión aún — esperando evento session-set…',
      howItWorks: 'Cómo funciona',
      apiSession: '→ devuelve el token de sesión actual',
      apiOn: '→ se dispara cuando se asigna la sesión',
    },

    // --- Panel de UTM ---
    utm: {
      title: 'Captura UTM',
      description: 'El SDK captura automáticamente los parámetros UTM de la URL y dispara el evento {code}. Agrega parámetros UTM a la URL y recarga para probar.',
      utmSetCode: 'utm-set',
      testUrl: 'URL de Prueba',
      openWithUtm: 'Abrir con parámetros UTM',
      capturedData: 'Datos UTM Capturados',
      parameterCol: 'Parámetro',
      valueCol: 'Valor',
      noData: 'No se han capturado datos UTM — agrega parámetros UTM a la URL y recarga.',
    },

    // --- Panel de Seguimiento ---
    tracking: {
      title: 'Eventos de Seguimiento',
      description: 'Dispara eventos de seguimiento usando {code}. Haz clic en un botón predefinido o ingresa un evento personalizado.',
      trackCode: 'Hellotext.track(eventName, params)',
      presetEvents: 'Eventos Predefinidos',
      sending: 'Enviando…',
      customEvent: 'Evento Personalizado',
      eventName: 'Nombre del Evento',
      eventNamePlaceholder: 'ej. page.viewed',
      parameters: 'Parámetros',
      json: '(JSON)',
      fireCustom: 'Disparar Evento',
      invalidJson: 'JSON inválido en el campo de parámetros',
    },

    // --- Panel de Formularios ---
    forms: {
      title: 'Formularios',
      description: 'El SDK descubre elementos con el atributo {code} y monta formularios de Hellotext en ellos. Ingresa un Form ID para probar.',
      dataHelloForm: 'data-hello-form',
      mountForm: 'Montar Formulario',
      formId: 'Form ID',
      formIdPlaceholder: 'ej. aBcDeFgH',
      mountBtn: 'Montar',
      unmountBtn: 'Desmontar',
      placeholder: 'El formulario se mostrará aquí después de montarlo',
      events: 'Eventos',
      formsCollectedHint: '→ se dispara cuando se descubren formularios en la página',
      formCompletedHint: '→ se dispara cuando un usuario completa un formulario y verifica OTP',
    },

    // --- Panel de Webchat ---
    webchat: {
      title: 'Webchat',
      descriptionDefault: 'El SDK monta automáticamente el webchat cuando está configurado.',
      withId: 'Inicializado con Webchat ID: {id}.',
      withoutId: 'Usando la configuración de webchat del panel (no se especificó un ID de sobreescritura).',
      status: 'Estado',
      statusDescription: 'Si el webchat está configurado para tu negocio, el widget debería aparecer en la esquina inferior derecha de esta página. Interactúa con él y observa los eventos en el Registro de Eventos.',
      monitoredEvents: 'Eventos Monitoreados',
      configuration: 'Configuración',
    },

    // --- Registro de Eventos ---
    eventLog: {
      title: 'Registro de Eventos',
      clear: 'Limpiar',
      empty: 'Los eventos aparecerán aquí…',
    },

    // --- Común ---
    common: {
      language: 'Idioma',
    },
  },
};

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const value = useMemo(() => {
    const lang = detectLanguage();
    const t = translations[lang] || translations.en;

    const setLanguage = (newLang) => {
      localStorage.setItem('ht_language', newLang);
      window.location.reload();
    };

    return { lang, t, setLanguage, languages: ['en', 'es'] };
  }, []);

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within an I18nProvider');
  return ctx;
}

export default translations;
