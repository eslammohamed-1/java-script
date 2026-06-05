import { useState, useEffect, useRef } from 'react';

const POMODORO_WORK = 25 * 60;
const POMODORO_BREAK = 5 * 60;

export default function PomodoroTimer() {
  const [minimized, setMinimized] = useState(true);
  const [timeLeft, setTimeLeft] = useState(POMODORO_WORK);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(() => {
    try { return parseInt(localStorage.getItem('pomodoro-sessions') || '0', 10); } catch { return 0; }
  });

  const timerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('pomodoro-sessions', sessions.toString());
  }, [sessions]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      clearInterval(timerRef.current);
      playBeep();
      if (!isBreak) {
        setSessions(s => s + 1);
        setIsBreak(true);
        setTimeLeft(POMODORO_BREAK);
        setIsActive(false); // auto pause on transition
      } else {
        setIsBreak(false);
        setTimeLeft(POMODORO_WORK);
        setIsActive(false);
      }
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft, isBreak]);

  function playBeep() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch(e) { console.error('Audio api error', e); }
  }

  function toggleTimer() {
    setIsActive(!isActive);
  }

  function resetTimer() {
    setIsActive(false);
    setIsBreak(false);
    setTimeLeft(POMODORO_WORK);
  }

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalTime = isBreak ? POMODORO_BREAK : POMODORO_WORK;
  const progressPercent = ((totalTime - timeLeft) / totalTime) * 100;
  
  if (minimized) {
    return (
      <div className="pomodoro pomodoro--minimized" onClick={() => setMinimized(false)} title="افتح مؤقت بومودورو">
        <div className="pomodoro__mini-btn">⏱️</div>
      </div>
    );
  }

  return (
    <div className="pomodoro animate-slide-up">
      <button className="pomodoro__toggle" onClick={() => setMinimized(true)}>
        تصغير ↘
      </button>
      <div className="pomodoro__label">
        {isBreak ? '☕ وقت الراحة' : '💻 وقت التركيز'}
      </div>
      <div className="pomodoro__ring-wrap">
        <div className="dashboard__progress-ring" style={{width: 100, height: 100}}>
          <svg width="100" height="100">
            <circle cx="50" cy="50" r="45" fill="transparent" stroke="var(--border)" strokeWidth="6" />
            <circle cx="50" cy="50" r="45" fill="transparent" stroke={isBreak ? "var(--success)" : "var(--accent)"} strokeWidth="6" 
              strokeDasharray={283} strokeDashoffset={283 - (283 * progressPercent) / 100} style={{transition: 'stroke-dashoffset 1s linear'}} />
          </svg>
          <div className="pomodoro__time">{formatTime(timeLeft)}</div>
        </div>
      </div>
      <div className="pomodoro__controls">
        <button className={`pomodoro__btn ${isActive ? '' : 'pomodoro__btn--primary'}`} onClick={toggleTimer}>
          {isActive ? 'إيقاف مؤقت' : 'ابدأ'}
        </button>
        <button className="pomodoro__btn" onClick={resetTimer}>
          إعادة
        </button>
      </div>
      <div className="pomodoro__sessions">
        أنهيت: {sessions} جلسات 🍅
      </div>
    </div>
  );
}
