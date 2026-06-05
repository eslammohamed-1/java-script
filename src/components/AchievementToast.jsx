import { useEffect, useState } from 'react';

export default function AchievementToast({ badge, onDismiss }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger slide-in on next frame so the CSS transition fires
    const rafId = requestAnimationFrame(() => setVisible(true));

    const timer = setTimeout(() => {
      setVisible(false);
      // Wait for the slide-out animation before calling onDismiss
      setTimeout(onDismiss, 350);
    }, 4000);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
    };
  }, [onDismiss]);

  function handleClose() {
    setVisible(false);
    setTimeout(onDismiss, 350);
  }

  return (
    <div className={`achievement-toast${visible ? ' achievement-toast--visible' : ''}`}>
      <span className="achievement-toast__icon">{badge.icon}</span>
      <div className="achievement-toast__content">
        <strong className="achievement-toast__title">{badge.title}</strong>
        <p className="achievement-toast__desc">{badge.desc}</p>
      </div>
      <button
        type="button"
        className="achievement-toast__close"
        onClick={handleClose}
        title="إغلاق"
      >
        ✕
      </button>
    </div>
  );
}
