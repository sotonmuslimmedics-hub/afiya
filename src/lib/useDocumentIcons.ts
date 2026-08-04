import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface IconSet {
  favicon: string;
  appleTouchIcon: string;
  manifest: string;
  themeColor: string;
  appTitle: string;
}

const STUDENT: IconSet = {
  favicon: '/favicon.png',
  appleTouchIcon: '/apple-touch-icon.png',
  manifest: '/manifest.webmanifest',
  themeColor: '#f3f2f2',
  appTitle: 'Afiya',
};

const WELFARE: IconSet = {
  favicon: '/favicon-welfare.png',
  appleTouchIcon: '/apple-touch-icon-welfare.png',
  manifest: '/manifest-welfare.webmanifest',
  themeColor: '#000000',
  appTitle: 'Afiya Welfare',
};

function setLinkHref(rel: string, href: string) {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

function setMetaContent(name: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.name = name;
    document.head.appendChild(el);
  }
  el.content = content;
}

/**
 * Swaps the home-screen icon / manifest / theme-color for the Welfare Team
 * app so "Add to Home Screen" from /welfare gets its own distinct icon,
 * even though this is one SPA with one index.html.
 */
export function useDocumentIcons() {
  const location = useLocation();

  useEffect(() => {
    const set = location.pathname.startsWith('/welfare') ? WELFARE : STUDENT;
    setLinkHref('icon', set.favicon);
    setLinkHref('apple-touch-icon', set.appleTouchIcon);
    setLinkHref('manifest', set.manifest);
    setMetaContent('theme-color', set.themeColor);
    setMetaContent('apple-mobile-web-app-title', set.appTitle);
  }, [location.pathname]);
}
