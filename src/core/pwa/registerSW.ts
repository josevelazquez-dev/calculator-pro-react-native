export function registerServiceWorker(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        registration.update();
      })
      .catch(() => {
        // Service worker registration failed silently
      });
  });
}

function ensureLink(rel: string, href: string, sizes?: string): void {
  const existing = document.querySelector(`link[rel="${rel}"]`);
  if (existing) return;

  const link = document.createElement('link');
  link.rel = rel;
  link.href = href;
  if (sizes) link.setAttribute('sizes', sizes);
  document.head.appendChild(link);
}

export function ensureManifestLink(): void {
  if (typeof document === 'undefined') return;
  ensureLink('manifest', '/manifest.json');
  ensureLink('apple-touch-icon', '/apple-touch-icon.png', '180x180');
}
