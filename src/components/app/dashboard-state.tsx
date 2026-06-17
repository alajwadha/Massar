'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { parseUploadedConnections, type Contact, type ContactStatus, type Level } from '@/lib/app-data';

/* ------------------------------------------------------------ network -- */
// The customer's uploaded LinkedIn network. Kept in sessionStorage (per link) so a
// refresh keeps it, but it clears when the tab closes and never leaves the browser.

type NetworkCtx = { network: Contact[] | null; setFromCsv: (text: string) => void; clear: () => void };
const NetworkContext = createContext<NetworkCtx | null>(null);

export function useNetwork(): NetworkCtx {
  const c = useContext(NetworkContext);
  if (!c) throw new Error('useNetwork must be used inside <DashboardState>');
  return c;
}

/* ----------------------------------------------------------- progress -- */
// Manual outreach statuses + completed certifications, persisted in localStorage
// per link so the customer's progress survives reloads.

type ProgressCtx = {
  statuses: Record<string, ContactStatus>;
  setStatus: (id: string, s: ContactStatus) => void;
  certsDone: Record<string, boolean>;
  toggleCert: (nameEn: string) => void;
  cvFixed: Record<string, boolean>;
  toggleCvFix: (id: string) => void;
  level: Level;
  setLevel: (l: Level) => void;
};
const ProgressContext = createContext<ProgressCtx | null>(null);

export function useProgress(): ProgressCtx {
  const c = useContext(ProgressContext);
  if (!c) throw new Error('useProgress must be used inside <DashboardState>');
  return c;
}

export function DashboardState({
  slug,
  initialCertsDone,
  children,
}: {
  slug: string;
  initialCertsDone: string[];
  children: ReactNode;
}) {
  // ---- network (sessionStorage) ----
  const [network, setNetwork] = useState<Contact[] | null>(null);
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(`masaar:net:${slug}`);
      setNetwork(raw ? (JSON.parse(raw) as Contact[]) : null);
    } catch {
      /* storage may be unavailable */
    }
  }, [slug]);
  const setFromCsv = (text: string) => {
    const list = parseUploadedConnections(text);
    setNetwork(list);
    try { sessionStorage.setItem(`masaar:net:${slug}`, JSON.stringify(list)); } catch { /* ignore */ }
  };
  const clearNetwork = () => {
    setNetwork(null);
    try { sessionStorage.removeItem(`masaar:net:${slug}`); } catch { /* ignore */ }
  };

  // ---- progress (localStorage) ----
  const [statuses, setStatuses] = useState<Record<string, ContactStatus>>({});
  const [certsDone, setCertsDone] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(initialCertsDone.map((n) => [n, true])),
  );
  const [cvFixed, setCvFixed] = useState<Record<string, boolean>>({});
  const [level, setLevel] = useState<Level>('entry');
  // A state flag (not a ref): a ref would flip to true synchronously inside the
  // hydration effect, so the save effect would fire in the SAME pass with stale
  // empty state and clobber localStorage. As state, the save effect skips the
  // first render and only persists once the hydrated values are in.
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`masaar:progress:${slug}`);
      if (raw) {
        const p = JSON.parse(raw) as {
          statuses?: Record<string, ContactStatus>;
          certsDone?: Record<string, boolean>;
          cvFixed?: Record<string, boolean>;
          level?: Level;
        };
        if (p.statuses) setStatuses(p.statuses);
        if (p.certsDone) setCertsDone((prev) => ({ ...prev, ...p.certsDone }));
        if (p.cvFixed) setCvFixed(p.cvFixed);
        if (p.level) setLevel(p.level);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, [slug]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(`masaar:progress:${slug}`, JSON.stringify({ statuses, certsDone, cvFixed, level }));
    } catch {
      /* ignore */
    }
  }, [hydrated, statuses, certsDone, cvFixed, level, slug]);

  const network_ = useMemo<NetworkCtx>(
    () => ({ network, setFromCsv, clear: clearNetwork }),
    [network], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const progress_ = useMemo<ProgressCtx>(
    () => ({
      statuses,
      certsDone,
      cvFixed,
      level,
      setLevel,
      setStatus: (id, s) => setStatuses((prev) => ({ ...prev, [id]: s })),
      toggleCert: (n) => setCertsDone((prev) => ({ ...prev, [n]: !prev[n] })),
      toggleCvFix: (id) => setCvFixed((prev) => ({ ...prev, [id]: !prev[id] })),
    }),
    [statuses, certsDone, cvFixed, level],
  );

  return (
    <NetworkContext.Provider value={network_}>
      <ProgressContext.Provider value={progress_}>{children}</ProgressContext.Provider>
    </NetworkContext.Provider>
  );
}
