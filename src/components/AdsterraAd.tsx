import { useMemo } from 'react';

export type AdUnit = 'leaderboard' | 'rectangle';

type UnitConfig = {
  key: string;
  width: number;
  height: number;
  scriptUrl: string;
};

const UNITS: Record<AdUnit, UnitConfig> = {
  leaderboard: {
    key: '446e4b7009b15f8c408aea134bfa0eb4',
    width: 728,
    height: 90,
    scriptUrl: 'https://bauval.org/22/446e4b7009b15f8c408aea134bfa0eb4',
  },
  rectangle: {
    key: '2f92e0ed99b9871d0d66e193ba63d266',
    width: 300,
    height: 250,
    scriptUrl: 'https://bauval.org/22/2f92e0ed99b9871d0d66e193ba63d266',
  },
};

// Each unit gets its own srcdoc iframe because Adsterra's invoke.js uses
// document.write and window.atOptions, which cannot be shared across units.
function buildAdDocument({ key, width, height, scriptUrl }: UnitConfig) {
  const options = JSON.stringify({
    key,
    format: 'iframe',
    height,
    width,
    params: {},
  });
  return `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style></head><body><script>atOptions=${options}</script><script src="${scriptUrl}"></script></body></html>`;
}

type Props = {
  unit: AdUnit;
};

export default function AdsterraAd({ unit }: Props) {
  const config = UNITS[unit];
  const srcDoc = useMemo(() => buildAdDocument(config), [config]);
  return (
    <div className={`ad-slot ad-slot-${unit}`}>
      <iframe
        title={`Advertisement ${unit}`}
        srcDoc={srcDoc}
        width={config.width}
        height={config.height}
        scrolling="no"
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
        referrerPolicy="no-referrer-when-downgrade"
        style={{ display: 'block', border: 0 }}
      />
    </div>
  );
}
