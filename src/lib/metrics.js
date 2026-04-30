/**
 * Lightweight analytics client.
 * Streams events to /api/metrics/track/.
 * Only sends data when the user has granted analytics cookie consent.
 */

const SESSION_KEY = 'careerleap_metrics_session';
const API_URL = import.meta.env.VITE_API_URL || '/api';

function getSessionId() {
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

function hasAnalyticsConsent() {
  try {
    const raw = localStorage.getItem('careerleap_cookie_consent');
    if (!raw) return false;
    const consent = JSON.parse(raw);
    return consent.analytics === true;
  } catch {
    return false;
  }
}

function getAuthToken() {
  return localStorage.getItem('accessToken');
}

/**
 * Track a generic event.
 * Silently fails (no throw) so it never breaks user experience.
 */
export async function trackEvent(eventType, metadata = {}) {
  if (!hasAnalyticsConsent()) return;

  const payload = {
    event_type: eventType,
    page_path: window.location.pathname + window.location.search,
    session_id: getSessionId(),
    metadata: {
      ...metadata,
      url: window.location.href,
      referrer: document.referrer || null,
      userAgent: navigator.userAgent,
      language: navigator.language,
      screen: `${window.screen.width}x${window.screen.height}`,
    },
  };

  try {
    const headers = {
      'Content-Type': 'application/json',
    };
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    await fetch(`${API_URL}/metrics/track/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // Silently ignore network errors
  }
}

/**
 * Track a page view.
 */
export function trackPageView(path) {
  trackEvent('page_view', { path });
}

/**
 * Track a custom user action (e.g., button click, form start).
 */
export function trackAction(actionName, extra = {}) {
  trackEvent('action', { action: actionName, ...extra });
}

/**
 * React hook helper: call once per route change.
 * Usage: useEffect(() => { trackPageView(location.pathname); }, [location]);
 */
export { getSessionId, hasAnalyticsConsent };
