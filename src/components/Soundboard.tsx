import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { AudioLines, Square, Sparkles, Volume2 } from 'lucide-react';

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

type Synth = (ctx: AudioContext, out: AudioNode) => void;

type SoundDef = {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  file: string;
  color: string;
  synth: Synth;
};

type BlipOptions = {
  freq: number;
  to?: number;
  type?: OscillatorType;
  at?: number;
  dur?: number;
  gain?: number;
};

function blip(ctx: AudioContext, out: AudioNode, options: BlipOptions) {
  const { freq, to, type = 'sine', at = 0, dur = 0.25, gain = 0.12 } = options;
  const start = ctx.currentTime + at;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (to) osc.frequency.exponentialRampToValueAtTime(Math.max(1, to), start + dur);
  amp.gain.setValueAtTime(0.0001, start);
  amp.gain.linearRampToValueAtTime(gain, start + 0.012);
  amp.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  osc.connect(amp).connect(out);
  osc.start(start);
  osc.stop(start + dur + 0.05);
}

function noiseBurst(
  ctx: AudioContext,
  out: AudioNode,
  { at = 0, dur = 0.16, gain = 0.2, freq = 900 }: { at?: number; dur?: number; gain?: number; freq?: number }
) {
  const frames = Math.max(1, Math.ceil(ctx.sampleRate * dur));
  const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = freq;
  filter.Q.value = 0.8;
  const amp = ctx.createGain();
  amp.gain.value = gain;
  source.connect(filter).connect(amp).connect(out);
  source.start(ctx.currentTime + at);
}

const synthDaya: Synth = (ctx, out) => {
  [0, 0.3, 0.6].forEach((at) => {
    blip(ctx, out, { freq: 104, to: 52, at, dur: 0.2, gain: 0.34 });
    noiseBurst(ctx, out, { at, dur: 0.09, gain: 0.16, freq: 420 });
  });
  blip(ctx, out, { freq: 280, to: 120, type: 'sawtooth', at: 0.92, dur: 0.5, gain: 0.1 });
  blip(ctx, out, { freq: 190, to: 90, type: 'square', at: 0.94, dur: 0.46, gain: 0.05 });
};

const synthSamay: Synth = (ctx, out) => {
  const partials = [
    { freq: 58, gain: 0.26 },
    { freq: 87, gain: 0.14 },
    { freq: 116, gain: 0.1 },
    { freq: 174, gain: 0.06 },
    { freq: 232, gain: 0.03 },
  ];
  partials.forEach((partial, index) => {
    blip(ctx, out, {
      freq: partial.freq,
      type: index === 0 ? 'sine' : 'triangle',
      dur: 2.6 - index * 0.28,
      gain: partial.gain,
    });
  });
  noiseBurst(ctx, out, { dur: 0.12, gain: 0.18, freq: 220 });
  blip(ctx, out, { freq: 1180, to: 980, type: 'sine', at: 0.02, dur: 1.1, gain: 0.05 });
  blip(ctx, out, { freq: 330, to: 120, type: 'sawtooth', at: 0.16, dur: 0.9, gain: 0.06 });
};

const synthCid: Synth = (ctx, out) => {
  const pattern = [523, 392, 523, 392, 466, 349, 466, 349];
  pattern.forEach((freq, index) => {
    blip(ctx, out, {
      freq,
      type: 'square',
      at: index * 0.155,
      dur: 0.12,
      gain: 0.075,
    });
  });
  blip(ctx, out, { freq: 55, type: 'sawtooth', dur: 1.35, gain: 0.05 });
  blip(ctx, out, { freq: 880, to: 660, type: 'triangle', at: 1.24, dur: 0.4, gain: 0.06 });
};

const synthBoing: Synth = (ctx, out) => {
  blip(ctx, out, { freq: 720, to: 92, type: 'triangle', dur: 0.55, gain: 0.22 });
  blip(ctx, out, { freq: 540, to: 118, type: 'sine', at: 0.08, dur: 0.42, gain: 0.1 });
  blip(ctx, out, { freq: 380, to: 150, type: 'triangle', at: 0.36, dur: 0.3, gain: 0.11 });
  noiseBurst(ctx, out, { dur: 0.08, gain: 0.05, freq: 1600 });
};

const SOUNDS: SoundDef[] = [
  {
    id: 'daya-darwaza',
    title: 'Daya Darwaza Tod',
    subtitle: 'ACP Pradyuman, CID',
    emoji: '🚪',
    file: '/sounds/daya-darwaza.mp3',
    color: '#fb7185',
    synth: synthDaya,
  },
  {
    id: 'samay-samapt',
    title: 'Samay Samapt',
    subtitle: 'Amitabh dramatic gong',
    emoji: '⏳',
    file: '/sounds/samay-samapt.mp3',
    color: '#fbbf24',
    synth: synthSamay,
  },
  {
    id: 'cid-theme',
    title: 'CID Theme',
    subtitle: 'Suspense sting',
    emoji: '🕵️',
    file: '/sounds/cid-theme.mp3',
    color: '#38bdf8',
    synth: synthCid,
  },
  {
    id: 'cartoon-boing',
    title: 'Cartoon Boing',
    subtitle: 'Classic spring bounce',
    emoji: '🤸',
    file: '/sounds/cartoon-boing.mp3',
    color: '#a3e635',
    synth: synthBoing,
  },
];

export default function Soundboard() {
  const [playing, setPlaying] = useState<string | null>(null);
  const [files, setFiles] = useState<Record<string, boolean>>({});
  const contextRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const audioRef = useRef<Set<HTMLAudioElement>>(new Set());
  const timerRef = useRef<number | undefined>(undefined);

  const getContext = () => {
    if (!contextRef.current) {
      const Ctor = window.AudioContext ?? window.webkitAudioContext;
      if (!Ctor) return null;
      const ctx = new Ctor();
      const master = ctx.createGain();
      master.gain.value = 0.85;
      master.connect(ctx.destination);
      contextRef.current = ctx;
      masterRef.current = master;
    }
    return contextRef.current;
  };

  const clearTimer = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = undefined;
  };

  const stopAudio = () => {
    clearTimer();
    audioRef.current.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
    audioRef.current.clear();
    const ctx = contextRef.current;
    const master = masterRef.current;
    if (ctx && master) {
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(0, now);
    }
    setPlaying(null);
  };

  useEffect(() => {
    const controller = new AbortController();
    SOUNDS.forEach(async (sound) => {
      try {
        const response = await fetch(sound.file, {
          method: 'HEAD',
          cache: 'no-store',
          signal: controller.signal,
        });
        const type = response.headers.get('content-type') ?? '';
        setFiles((current) => ({ ...current, [sound.id]: response.ok && type.startsWith('audio') }));
      } catch {
        if (!controller.signal.aborted) {
          setFiles((current) => ({ ...current, [sound.id]: false }));
        }
      }
    });
    return () => controller.abort();
  }, []);

  useEffect(
    () => () => {
      clearTimer();
      audioRef.current.forEach((audio) => audio.pause());
      audioRef.current.clear();
      contextRef.current?.close().catch(() => {});
    },
    []
  );

  const play = async (sound: SoundDef) => {
    const ctx = getContext();
    if (!ctx) return;
    stopAudio();
    try {
      await ctx.resume();
    } catch {
      return;
    }
    const master = masterRef.current;
    if (!master) return;
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(0.85, now);

    setPlaying(sound.id);
    clearTimer();
    timerRef.current = window.setTimeout(() => setPlaying(null), 1800);

    if (files[sound.id]) {
      const audio = new Audio(sound.file);
      audioRef.current.add(audio);
      audio.addEventListener('ended', () => {
        audioRef.current.delete(audio);
        setPlaying((current) => (current === sound.id ? null : current));
      });
      audio.play().catch(() => {
        audioRef.current.delete(audio);
        sound.synth(ctx, master);
      });
    } else {
      sound.synth(ctx, master);
    }
  };

  return (
    <main className="wrap page-pad soundboard-page">
      <div className="page-heading">
        <span className="eyebrow">
          <i /> DESI MEME JUKEBOX
        </span>
        <h1>
          MEME <span className="gradient-text">SOUNDBOARD 🔊</span>
        </h1>
        <p>
          Tap a pad for instant Bollywood-grade drama. Every sound is synthesized live in your
          browser, so it works even before any MP3 is uploaded.
        </p>
      </div>

      <div className="sound-grid">
        {SOUNDS.map((sound) => (
          <button
            type="button"
            key={sound.id}
            className={`sound-pad ${playing === sound.id ? 'is-playing' : ''}`}
            style={{ '--pad-color': sound.color } as CSSProperties}
            onClick={() => play(sound)}
            aria-pressed={playing === sound.id}
          >
            <span className="sound-emoji" aria-hidden="true">
              {sound.emoji}
            </span>
            <b>{sound.title}</b>
            <small>{sound.subtitle}</small>
            <span className="sound-status">
              <i />
              {playing === sound.id ? 'PLAYING' : files[sound.id] ? 'MP3 READY' : 'SYNTH READY'}
            </span>
          </button>
        ))}
      </div>

      <div className="sound-footer">
        <button type="button" className="btn secondary" onClick={stopAudio}>
          <Square size={14} /> Stop all
        </button>
        <div className="sound-note">
          <Volume2 size={15} />
          <span>
            Web Audio fallback is active. Drop your own clips into <code>/public/sounds</code> to
            upgrade any pad automatically.
          </span>
        </div>
        <span className="sound-badge">
          <Sparkles size={13} /> 4 PADS
        </span>
      </div>

      <div className="sound-tip">
        <AudioLines size={16} />
        Tip: connect headphones before dropping the Samay Samapt gong on an unsuspecting group
        chat.
      </div>
    </main>
  );
}
