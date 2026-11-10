import { useMemo } from 'react';

export type AdUnit = 'leaderboard' | 'rectangle' | 'skyscraper';

type UnitConfig = {
  key: string;
  width: number;
  height: number;
  scriptUrl: string;
  label: string;
};

const UNITS: Record<AdUnit, UnitConfig> = {
  leaderboard: {
    key: '446e4b7009b15f8c408aea134bfa0eb4',
    width: 728,
    height: 90,
    scriptUrl: 'https://bauval.org/22/446e4b7009b15f8c408aea134bfa0eb4',
    label: 'Leaderboard 728x90',
  },
  rectangle: {
    key: '2f92e0ed99b9871d0d66e193ba63d266',
    width: 300,
    height: 250,
    scriptUrl: 'https://bauval.org/22/2f92e0ed99b9871d0d66e193ba63d266',
    label: 'Medium rectangle 300x250',
  },
  skyscraper: {
    key: 'bbcb7c59aefc7bcd64921605f4d8f0ad',
    width: 160,
    height: 600,
    scriptUrl: 'https://bauval.org/22/bbcb7c59aefc7bcd64921605f4d8f0ad',
    label: 'Skyscraper 160x600',
  },
};

// Each banner lives in its own srcdoc iframe so every unit gets a private
// window.atOptions. Adsterra's invoke.js writes its iframe into the current
// document, which would clash if several units shared the page window.
function buildAdDocument(config: UnitConfig) {
  const options = JSON.stringify({
    key: config.key,
    format: 'iframe',
    height: config.height,
    width: config.width,
    params: {},
  });
  return `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style></head><body><script>atOptions=${options}</script><script src="${config.scriptUrl}"></script></body></html>`;
}

type Props = {
  unit: AdUnit;
  variant?: 'bar' | 'card' | 'strip' | 'inline' | 'rail';
  className?: string;
};

export default function AdsterraAd({ unit, variant = 'bar', className = '' }: Props) {
  const config = UNITS[unit];
  const preview = import.meta.env.DEV && import.meta.env.VITE_ADSTERRA_PREVIEW !== 'false';
  const srcDoc = useMemo(() => buildAdDocument(config), [config]);

  const classes = `ad-slot ad-slot-${unit} ad-${variant} ${className}`.trim();

  if (preview) {
    return (
      <div
        className={`${classes} ad-placeholder`}
        data-ad-unit={unit}
        aria-label="Advertisement placeholder"
      >
        <span>AD</span>
        <small>{config.label}</small>
        <em>Adsterra banner</em>
      </div>
    );
  }

  return (
    <div className={classes} data-ad-unit={unit} aria-label="Advertisement">
      <iframe
        title={config.label}
        srcDoc={srcDoc}
        width={config.width}
        height={config.height}
        scrolling="no"
        frameBorder={0}
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
