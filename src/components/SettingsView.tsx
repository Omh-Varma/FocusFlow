import { useState } from 'react';
import { User, Bell, Palette, Timer, Shield, Check } from 'lucide-react';
import { Card } from './ui';
import { useTheme } from '@/context/ThemeContext';

function Toggle({ on, setOn }: { on: boolean; setOn: (v: boolean) => void }) {
  return (
    <button
      onClick={() => setOn(!on)}
      className={`relative h-7 w-14 rounded-full border-2 border-ink-900 transition-all duration-200 ${on ? 'bg-sage-300' : 'bg-cream-100'}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full border-2 border-ink-900 bg-white shadow-neo-sm transition-transform duration-200 ${on ? 'translate-x-[28px]' : 'translate-x-0.5'}`} />
    </button>
  );
}

export function SettingsView() {
  const { theme, setTheme } = useTheme();
  const [notif, setNotif] = useState({ task: true, schedule: true, streak: false, weekly: true });
  const [pomodoroLen, setPomodoroLen] = useState(25);

  const themeOptions: { key: typeof theme; bg: string; label: string }[] = [
    { key: 'cream', bg: 'bg-yellow-200', label: 'Cream' },
    { key: 'sage', bg: 'bg-sage-200', label: 'Sage' },
    { key: 'lavender', bg: 'bg-lavender-200', label: 'Lavender' },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl font-bold text-ink-900">Settings</h2>
        <p className="text-sm font-medium text-ink-700">Customize your FocusFlow workspace</p>
      </div>

      {/* Appearance */}
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink-900 bg-lavender-200 shadow-neo-sm">
            <Palette className="h-5 w-5 text-ink-900" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold text-ink-900">Appearance</h3>
            <p className="text-[11px] font-medium text-ink-700">Choose your accent theme</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {themeOptions.map((t) => (
            <button
              key={t.key}
              onClick={() => setTheme(t.key)}
              className={`flex items-center gap-3 rounded-xl border-2 p-3 transition-all ${
                theme === t.key ? 'border-ink-900 bg-white shadow-neo-sm' : 'border-ink-900 bg-cream-100 hover:bg-white'
              }`}
            >
              <div className={`h-10 w-10 rounded-lg border-2 border-ink-900 ${t.bg}`} />
              <div className="flex-1 text-left">
                <p className="text-sm font-bold text-ink-900">{t.label}</p>
              </div>
              {theme === t.key && <Check className="h-5 w-5 text-ink-900" strokeWidth={3} />}
            </button>
          ))}
        </div>
      </Card>

      {/* Pomodoro */}
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink-900 bg-peach-200 shadow-neo-sm">
            <Timer className="h-5 w-5 text-ink-900" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold text-ink-900">Pomodoro</h3>
            <p className="text-[11px] font-medium text-ink-700">Default focus session length</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {[15, 25, 30, 45, 50].map((m) => (
            <button
              key={m}
              onClick={() => setPomodoroLen(m)}
              className={`rounded-xl border-2 border-ink-900 px-3.5 py-2 text-sm font-bold transition-all ${
                pomodoroLen === m ? 'bg-ink-900 text-white shadow-neo-sm' : 'bg-white text-ink-900 hover:bg-cream-100'
              }`}
            >
              {m} min
            </button>
          ))}
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink-900 bg-yellow-200 shadow-neo-sm">
            <Bell className="h-5 w-5 text-ink-900" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold text-ink-900">Notifications</h3>
            <p className="text-[11px] font-medium text-ink-700">Stay in the loop</p>
          </div>
        </div>
        <div className="space-y-3">
          {([
            ['task', 'Task reminders', 'Get notified about upcoming deadlines'],
            ['schedule', 'Schedule alerts', 'Heads up before classes and exams'],
            ['streak', 'Streak warnings', 'Alert before losing your daily streak'],
            ['weekly', 'Weekly digest', 'A summary of your week every Sunday'],
          ] as const).map(([key, title, desc]) => (
            <div key={key} className="flex items-center justify-between gap-4 rounded-xl border-2 border-ink-900 bg-cream-100 p-3.5">
              <div>
                <p className="text-sm font-bold text-ink-900">{title}</p>
                <p className="text-[11px] font-medium text-ink-700">{desc}</p>
              </div>
              <Toggle on={notif[key]} setOn={(v) => setNotif((n) => ({ ...n, [key]: v }))} />
            </div>
          ))}
        </div>
      </Card>

      {/* Profile / privacy */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[
          { icon: User, title: 'Profile', desc: 'Avery Moore · avery@university.edu · Computer Science', bg: 'bg-sky-200' },
          { icon: Shield, title: 'Privacy', desc: 'Your data stays on this device. No account required.', bg: 'bg-sage-200' },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.title} className="p-5">
              <div className="mb-2 flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg border-2 border-ink-900 ${s.bg} shadow-neo-sm`}>
                  <Icon className="h-4 w-4 text-ink-900" strokeWidth={2.5} />
                </div>
                <h3 className="font-display text-sm font-bold text-ink-900">{s.title}</h3>
              </div>
              <p className="text-xs font-medium leading-relaxed text-ink-700">{s.desc}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
