import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    atOptions?: Record<string, unknown>;
  }
}

export type AdPlacement = 'header' | 'grid' | 'modal';

type PlacementConfig = {
  envKey: string;
  width: number;
  height: number;
  label: string;
};

const PLACEMENTS: Record<AdPlacement, PlacementConfig> = {
  header: {
    envKey: 'VITE_ADSTERRA_HOME_BANNER',
    width: 728,
    height: 90,
    label: 'Header leaderboard',
  },
  grid: {
    envKey: 'VITE_ADSTERRA_GAME_BANNER',
    width: 300,
    height: 250,
    label: 'In-feed rectangle',
  },
  modal: {
    envKey: 'VITE_ADSTERRA_MODAL_BANNER',
    width: 320,
    height: 50,
    label: 'Game overlay strip',
  },
};

const AD_HOST = 'https://www.highperformanceformat.com';

function resolveSlot(raw?: string) {
  const value = raw?.trim();
  if (!value) return null;
  if (value.startsWith('//')) return resolveSlot(`https:${value}`);
  if (/^https?:\/\//i.test(value)) {
    const parts = value.split('/').filter(Boolean);
    const key = parts[parts.length - 2] ?? '';
    return { scriptUrl: value, key };
  }
  return { scriptUrl: `${AD_HOST}/${encodeURIComponent(value)}/invoke.js`, key: value };
}

// Adsterra's invoke.js reads the shared window.atOptions global. Inject one slot
// at a time so concurrent containers can never overwrite each other's config.
let injectionQueue: Promise<void> = Promise.resolve();

type Props = {
  placement: AdPlacement;
  variant?: 'bar' | 'card' | 'strip';
  className?: string;
};

export default function AdsterraAd({ placement, variant = 'bar', className = '' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const config = PLACEMENTS[placement];
  const enabled = import.meta.env.VITE_ADSTERRA_ENABLED !== 'false';
  const slot = enabled
    ? resolveSlot(import.meta.env[config.envKey] as string | undefined)
    : null;

  useEffect(() => {
    const container = containerRef.current;
    if (!slot || !container) return;

    let cancelled = false;

    const inject = async () => {
      if (cancelled || !container.isConnected) return;
      container.innerHTML = '';
      window.atOptions = {
        key: slot.key,
        format: 'iframe',
        height: config.height,
        width: config.width,
        params: {},
      };
      await new Promise<void>((resolve) => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = slot.scriptUrl;
        script.dataset.adsterraSlot = placement;
        let timer = 0;
        const finish = () => {
          window.clearTimeout(timer);
          resolve();
        };
        timer = window.setTimeout(finish, 6000);
        script.onload = finish;
        script.onerror = finish;
        container.appendChild(script);
      });
    };

    injectionQueue = injectionQueue.then(inject, inject);

    return () => {
      cancelled = true;
      container.innerHTML = '';
    };
  }, [slot?.scriptUrl, slot?.key, config.width, config.height, placement]);

  if (!slot) {
    if (!import.meta.env.DEV) return null;
    return (
      <div
        className={`ad-slot ad-slot-${placement} ad-${variant} ad-placeholder ${className}`}
        data-ad-slot={config.label}
        aria-label="Advertisement placeholder"
      >
        <span>AD</span>
        <small>{config.label}</small>
        <em>Add {config.envKey}</em>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`ad-slot ad-slot-${placement} ad-${variant} ${className}`}
      data-ad-slot={config.label}
      aria-label="Advertisement"
    />
  );
}
