import { useEffect } from 'react';

// Generic full-screen modal shell: dimmed backdrop + sliding panel + close bar.
// Closes on backdrop tap and the Esc key. `size` => "sheet" for the bottom-sheet
// style used on small screens.
export default function Modal({ title, onClose, children, size = 'panel', labelId }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby={labelId}>
      <div className="modal__backdrop" onClick={onClose} />
      <div className={`modal__panel modal__panel--${size}`}>
        <header className="modal__bar">
          <h2 className="modal__title" id={labelId}>
            {title}
          </h2>
          <button className="modal__close" onClick={onClose} aria-label="Close" type="button">
            ✕
          </button>
        </header>
        <div className="modal__content">{children}</div>
      </div>
    </div>
  );
}
