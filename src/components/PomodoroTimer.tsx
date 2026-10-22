import { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';
import { Card } from './ui';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const MODES = [
  { key: 'focus', label: 'Focus', minutes: 25, icon: Brain, bg: 'bg-lavender-200', ring: '#9A7DD0' },
  { key: 'short', label: 'Short break', minutes: 5, icon: Coffee, bg: 'bg-sage-200', ring: '#6BB386' },
  { key: 'long', label: 'Long break', minutes: 15, icon: Coffee, bg: 'bg-peach-200', ring: '#E8966E' },
] as const;

export function PomodoroTimer() {
  const [modeIdx, setModeIdx] = useLocalStorage('ff-timer-mode', 0);
  const mode = MODES[modeIdx] ?? MODES[0];
  const [secondsLeft, setSecondsLeft] = useLocalStorage('ff-timer-seconds', mode.minutes * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useLocalStorage('ff-timer-sessions', 3);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (running && secondsLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            setRunning(false);
            if (mode.key === 'focus') setSessions((n) => n + 1);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, secondsLeft, mode.key]);

  const switchMode = (idx: number) => {
    setModeIdx(idx);
    setSecondsLeft((MODES[idx] ?? mode).minutes * 60);
    setRunning(false);
  };

  const reset = () => {
    setSecondsLeft(mode.minutes * 60);
    setRunning(false);
  };

  const total = mode.minutes * 60;
  const safeSeconds = Math.min(secondsLeft, total);
  const progress = 1 - safeSeconds / total;
  const R = 92;
  const C = 2 * Math.PI * R;
  const mm = Math.floor(safeSeconds / 60).toString().padStart(2, '0');
  const ss = (safeSeconds % 60).toString().padStart(2, '0');

  return (
    <Card className="relative overflow-hidden p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="font-display text-sm font-bold text-ink-900">Focus Timer</h3>
          <p className="text-[11px] font-medium text-ink-700">Pomodoro · Session {sessions}</p>
        </div>
        <span className={`rounded-full border-2 border-ink-900 px-2.5 py-1 text-xs font-bold shadow-neo-sm ${
          running ? 'bg-sage-300 text-ink-900' : 'bg-cream-100 text-ink-700'
        }`}>
          {running ? 'In progress' : 'Paused'}
        </span>
      </div>

      {/* Mode toggles */}
      <div className="mb-6 flex gap-2">
        {MODES.map((m, i) => (
          <button
            key={m.key}
            onClick={() => switchMode(i)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border-2 px-2 py-2 text-xs font-bold transition-all ${
              modeIdx === i
                ? `${m.bg} border-ink-900 text-ink-900 shadow-neo-sm`
                : 'border-ink-900 bg-white text-ink-700 hover:bg-cream-100'
            }`}
          >
            <m.icon className="h-3.5 w-3.5" strokeWidth={2.5} />
            <span className="hidden sm:inline">{m.label}</span>
          </button>
        ))}
      </div>

      {/* Circular timer */}
      <div className="relative mx-auto flex h-[220px] w-[220px] items-center justify-center">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r={R} fill="none" stroke="#F5F0E1" strokeWidth="10" />
          <circle
            cx="100"
            cy="100" r={R} fill="none" stroke={mode.ring} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - progress)}
            style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.4s ease' }}
          />
        </svg>
        <div className={`absolute inset-4 rounded-full border-2 border-ink-900 ${mode.bg} opacity-40`} />
        <div className="relative text-center">
          <p className="font-display text-5xl font-bold tabular-nums tracking-tight text-ink-900">
            {mm}:{ss}
          </p>
          <p className="mt-1 text-xs font-bold text-ink-700">{mode.label}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          onClick={() => setRunning((r) => !r)}
          className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-ink-900 bg-yellow-300 text-ink-900 shadow-neo transition-all hover:bg-yellow-200 active:translate-x-1 active:translate-y-1 active:shadow-none"
          aria-label={running ? 'Pause' : 'Start'}
        >
          {running ? <Pause className="h-6 w-6" fill="currentColor" /> : <Play className="h-6 w-6 translate-x-0.5" fill="currentColor" />}
        </button>
        <button
          onClick={reset}
          className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-ink-900 bg-white text-ink-900 shadow-neo transition-all hover:bg-cream-100 active:translate-x-1 active:translate-y-1 active:shadow-none"
          aria-label="Reset"
        >
          <RotateCcw className="h-6 w-6" strokeWidth={2.5} />
        </button>
      </div>
    </Card>
  );
}
