// Helper to get Google reCAPTCHA site key and ensure script is ready

let cachedSiteKey: string | null = null;
let siteKeyPromise: Promise<string> | null = null;

export async function getRecaptchaSiteKey(): Promise<string> {
  if (cachedSiteKey !== null) {
    return cachedSiteKey;
  }

  // 1. Check client-side Vite env variable first
  const envKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  if (envKey && typeof envKey === 'string' && envKey.trim().length > 0) {
    cachedSiteKey = envKey.trim();
    return cachedSiteKey;
  }

  // 2. Fetch from backend server config endpoint
  if (!siteKeyPromise) {
    siteKeyPromise = fetch('/api/recaptcha-config')
      .then((res) => res.json())
      .then((data) => {
        const key = (data?.siteKey || '').trim();
        cachedSiteKey = key;
        return key;
      })
      .catch((err) => {
        console.warn('Could not fetch recaptcha-config from server:', err);
        cachedSiteKey = '';
        return '';
      });
  }

  return siteKeyPromise;
}

export function loadGoogleRecaptchaScript(): Promise<any> {
  return new Promise((resolve) => {
    const w = window as any;
    if (w.grecaptcha && typeof w.grecaptcha.render === 'function') {
      if (typeof w.grecaptcha.ready === 'function') {
        w.grecaptcha.ready(() => resolve(w.grecaptcha));
      } else {
        resolve(w.grecaptcha);
      }
      return;
    }

    // Check if script already in DOM
    const existingScript = document.querySelector('script[src*="recaptcha/api.js"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js?render=explicit&hl=pt-PT';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    // Poll until ready or timeout after 4s
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (w.grecaptcha && typeof w.grecaptcha.render === 'function') {
        clearInterval(interval);
        if (typeof w.grecaptcha.ready === 'function') {
          w.grecaptcha.ready(() => resolve(w.grecaptcha));
        } else {
          resolve(w.grecaptcha);
        }
      } else if (attempts > 40) {
        clearInterval(interval);
        resolve(null);
      }
    }, 100);
  });
}
