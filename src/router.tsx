import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface RouterContextValue {
  path: string;
  params: Record<string, string>;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterContextValue>({ path: '/', params: {}, navigate: () => {} });

export function useRouter() {
  return useContext(RouterContext);
}

interface RouteConfig {
  pattern: string;
  element: ReactNode;
}

function matchRoute(pattern: string, path: string): Record<string, string> | null {
  const patternParts = pattern.split('/');
  const pathParts = path.split('/');
  if (patternParts.length !== pathParts.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      params[patternParts[i].slice(1)] = pathParts[i];
    } else if (patternParts[i] !== pathParts[i]) {
      return null;
    }
  }
  return params;
}

interface RouterProps {
  routes: RouteConfig[];
}

export function Router({ routes }: RouterProps) {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = (to: string) => {
    const hashIdx = to.indexOf('#');
    const pathOnly = hashIdx >= 0 ? to.slice(0, hashIdx) : to;
    const hash = hashIdx >= 0 ? to.slice(hashIdx + 1) : '';

    const currentPath = window.location.pathname;
    if (pathOnly === currentPath && hash) {
      window.history.pushState(null, '', to);
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    window.history.pushState(null, '', to);
    setPath(pathOnly || '/');

    if (hash) {
      requestAnimationFrame(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        else window.scrollTo(0, 0);
      });
    } else {
      window.scrollTo(0, 0);
    }
  };

  for (const route of routes) {
    const params = matchRoute(route.pattern, path);
    if (params !== null) {
      return (
        <RouterContext.Provider value={{ path, params, navigate }}>
          {route.element}
        </RouterContext.Provider>
      );
    }
  }
  return null;
}

interface LinkProps {
  to: string;
  className?: string;
  children: ReactNode;
}

export function Link({ to, className, children }: LinkProps) {
  const { navigate } = useRouter();
  return (
    <a
      href={to}
      className={className}
      onClick={(e) => { e.preventDefault(); navigate(to); }}
    >
      {children}
    </a>
  );
}

export function useParams<T extends Record<string, string>>(): T {
  const { params } = useRouter();
  return params as T;
}
