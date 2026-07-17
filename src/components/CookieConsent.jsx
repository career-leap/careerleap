import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, ChevronDown, ChevronUp, Shield, BarChart3, Check } from 'lucide-react';

const CONSENT_KEY = 'careerleap_cookie_consent';
const CONSENT_VERSION = '1';

const defaultConsent = {
  version: CONSENT_VERSION,
  timestamp: null,
  essential: true,
  analytics: false,
};

function getStoredConsent() {
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.version === CONSENT_VERSION) return parsed;
    }
  } catch {
    // ignore parse errors
  }
  return null;
}

function saveConsent(consent) {
  localStorage.setItem(
    CONSENT_KEY,
    JSON.stringify({ ...consent, version: CONSENT_VERSION, timestamp: new Date().toISOString() })
  );
}

export function useCookieConsent() {
  const [consent, setConsentState] = useState(() => getStoredConsent() || defaultConsent);
  const [showBanner, setShowBanner] = useState(() => !getStoredConsent());
  const [showSettings, setShowSettings] = useState(false);

  const acceptAll = useCallback(() => {
    const updated = { ...defaultConsent, essential: true, analytics: true };
    saveConsent(updated);
    setConsentState(updated);
    setShowBanner(false);
    setShowSettings(false);
  }, []);

  const rejectAll = useCallback(() => {
    const updated = { ...defaultConsent, essential: true, analytics: false };
    saveConsent(updated);
    setConsentState(updated);
    setShowBanner(false);
    setShowSettings(false);
  }, []);

  const saveCustom = useCallback((settings) => {
    const updated = { ...defaultConsent, ...settings };
    saveConsent(updated);
    setConsentState(updated);
    setShowBanner(false);
    setShowSettings(false);
  }, []);

  const openSettings = useCallback(() => {
    setShowSettings(true);
    setShowBanner(true);
  }, []);

  const closeBanner = useCallback(() => {
    setShowBanner(false);
    setShowSettings(false);
  }, []);

  return {
    consent,
    showBanner,
    showSettings,
    setShowSettings,
    acceptAll,
    rejectAll,
    saveCustom,
    openSettings,
    closeBanner,
    hasConsent: !!getStoredConsent(),
  };
}

function ConsentToggle({ label, description, enabled, locked, onChange }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-gray-900 dark:text-white">{label}</span>
          {locked && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 font-medium">
              Immer aktiv
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        disabled={locked}
        onClick={() => !locked && onChange?.(!enabled)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
          enabled ? 'bg-teal-600' : 'bg-gray-300 dark:bg-gray-600'
        } ${locked ? 'cursor-not-allowed opacity-70' : ''}`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

export default function CookieConsent() {
  const {
    consent,
    showBanner,
    showSettings,
    setShowSettings,
    acceptAll,
    rejectAll,
    saveCustom,
    closeBanner,
  } = useCookieConsent();

  const [localSettings, setLocalSettings] = useState({
    essential: true,
    analytics: consent.analytics,
  });

  // Sync local settings when opening settings
  useEffect(() => {
    if (showSettings) {
      setLocalSettings({
        essential: true,
        analytics: consent.analytics,
      });
    }
  }, [showSettings, consent]);

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-[100]"
        >
          {/* Backdrop for settings modal */}
          {showSettings && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={closeBanner}
            />
          )}

          <div
            className={`relative mx-auto mb-4 max-w-4xl rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl dark:shadow-gray-950/50 ${
              showSettings ? 'mx-4 md:mx-auto' : 'mx-4 md:mx-auto'
            }`}
          >
            {/* Banner content */}
            <div className="p-5 md:p-6">
              <div className="flex items-start gap-4">
                <div className="hidden sm:flex shrink-0 w-10 h-10 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">
                  <Cookie size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                    Wir respektieren Ihre Privatsphäre
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    Wir verwenden Cookies, um Ihnen die bestmögliche Erfahrung auf unserer Website zu bieten.
                    Notwendige Cookies sind für den Betrieb der Website erforderlich.
                    Analyse-Cookies helfen uns, die Website zu verbessern.
                    Weitere Informationen finden Sie in unserer{' '}
                    <a
                      href="/cookies"
                      className="text-teal-600 dark:text-teal-400 hover:underline font-medium"
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = '/cookies';
                      }}
                    >
                      Cookie-Richtlinie
                    </a>
                    .
                  </p>
                </div>
                <button
                  onClick={closeBanner}
                  className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Schließen"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Expandable Settings */}
              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-1">
                      <ConsentToggle
                        label="Notwendige Cookies"
                        description="Erforderlich für die Grundfunktionen der Website, z. B. Navigation und sichere Bereiche."
                        enabled={localSettings.essential}
                        locked
                      />
                      <ConsentToggle
                        label="Analyse-Cookies"
                        description="Helfen uns zu verstehen, wie Besucher unsere Website nutzen, damit wir sie verbessern können."
                        enabled={localSettings.analytics}
                        onChange={(val) =>
                          setLocalSettings((prev) => ({ ...prev, analytics: val }))
                        }
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions */}
              <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <button
                  onClick={() => setShowSettings((s) => !s)}
                  className="sm:mr-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
                >
                  {showSettings ? (
                    <>
                      <ChevronUp size={16} />
                      Weniger anzeigen
                    </>
                  ) : (
                    <>
                      <ChevronDown size={16} />
                      Einstellungen
                    </>
                  )}
                </button>

                {showSettings ? (
                  <button
                    onClick={() => saveCustom(localSettings)}
                    className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors shadow-sm"
                  >
                    <Check size={16} />
                    Auswahl speichern
                  </button>
                ) : (
                  <>
                    <button
                      onClick={rejectAll}
                      className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors"
                    >
                      Alle ablehnen
                    </button>
                    <button
                      onClick={acceptAll}
                      className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors shadow-sm"
                    >
                      Alle akzeptieren
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
