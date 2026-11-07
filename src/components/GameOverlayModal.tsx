import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Gamepad2 } from 'lucide-react';
import type { Game } from '../lib/games';
import AdsterraAd from './AdsterraAd';

type Props = {
  game: Game | null;
  onClose: () => void;
};

export default function GameOverlayModal({ game, onClose }: Props) {
  const [nonce, setNonce] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setNonce(0);
    setLoaded(false);
  }, [game?.id]);

  useEffect(() => {
    if (!game) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 40);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !document.fullscreenElement) onClose();
    };
    const onFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    onFullscreenChange();

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    };
  }, [game, onClose]);

  if (!game) return null;

  const toggleFullscreen = async () => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await dialog.requestFullscreen();
    } catch {
      // Fullscreen can be blocked by browser policy; the modal stays usable.
    }
  };

  const reload = () => {
    setLoaded(false);
    setNonce((value) => value + 1);
  };

  return createPortal(
    <div
      className="game-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="overlay-dialog"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${game.title} game player`}
      >
        <div className="overlay-bar">
          <span className="overlay-title">
            <Gamepad2 size={17} />
            <b>{game.title}</b>
          </span>
          <div className="overlay-controls">
            <button type="button" onClick={toggleFullscreen} aria-label="Toggle fullscreen">
              <span>{isFullscreen ? 'EXIT FULL' : 'FULLSCREEN'}</span>
              <em>⛶</em>
            </button>
            <button type="button" onClick={reload} aria-label="Reload game">
              <span>RELOAD</span>
              <em>🔄</em>
            </button>
            <button
              type="button"
              ref={closeRef}
              className="overlay-close"
              onClick={onClose}
              aria-label="Close game"
            >
              <span>CLOSE</span>
              <em>❌</em>
            </button>
          </div>
        </div>

        <div className="overlay-body">
          {game.gameUrl ? (
            <>
              <iframe
                key={`${game.id}-${nonce}`}
                src={game.gameUrl}
                title={game.title}
                allow="fullscreen; autoplay; gamepad; clipboard-write; encrypted-media; picture-in-picture"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                onLoad={() => setLoaded(true)}
              />
              {!loaded && (
                <div className="overlay-loading">
                  <span className="loader-ring" />
                  Loading {game.title}…
                </div>
              )}
            </>
          ) : (
            <div className="overlay-empty">
              <Gamepad2 size={34} />
              <h3>Game file not connected yet</h3>
              <p>This listing has no hosted game URL. Add one from the owner dashboard.</p>
            </div>
          )}
        </div>

        <div className="overlay-ad">
          <AdsterraAd placement="modal" variant="strip" />
        </div>
      </div>
    </div>,
    document.body
  );
}
