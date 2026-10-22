import { useMemo } from 'react';
import { AlertCircle, CalendarClock, Sun, Target } from 'lucide-react';
import { Task, isOverdue, isToday, isUpcoming } from '@/data/mock';
import { Card } from './ui';
import { TaskCard } from './TaskCard';

interface DailyOverviewProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
}

function ProgressRing({ pct }: { pct: number }) {
  const R = 34;
  const C = 2 * Math.PI * R;
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div className="relative flex h-24 w-24 items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={R} fill="none" stroke="#F5F0E1" strokeWidth="7" />
        <circle cx="40" cy="40" r={R} fill="none" stroke="#4E9A6B" strokeWidth="7" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C * (1 - clamped / 100)}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
      </svg>
      <p className="font-display text-xl font-bold tabular-nums text-ink-900">{Math.round(clamped)}%</p>
    </div>
  );
}

export function DailyOverview({ tasks, onToggle, onEdit }: DailyOverviewProps) {
  const overdue = useMemo(() => tasks.filter(isOverdue), [tasks]);
  const todayTasks = useMemo(() => tasks.filter(isToday), [tasks]);
  const upcoming = useMemo(() => tasks.filter(isUpcoming).sort((a, b) => (a.due! < b.due! ? -1 : 1)).slice(0, 5), [tasks]);

  const completionPct = useMemo(() => {
    const dated = tasks.filter((t) => isToday(t) || isOverdue(t));
    if (dated.length === 0) return tasks.length === 0 ? 0 : (tasks.filter((t) => t.status === 'done').length / tasks.length) * 100;
    return (dated.filter((t) => t.status === 'done').length / dated.length) * 100;
  }, [tasks]);

  const sections = [
    { key: 'overdue', label: 'Overdue', icon: AlertCircle, bg: 'bg-rose-200', items: overdue, empty: 'Nothing overdue — nice work' },
    { key: 'today', label: "Today's Tasks", icon: Sun, bg: 'bg-yellow-200', items: todayTasks, empty: 'No tasks due today' },
    { key: 'upcoming', label: 'Upcoming Deadlines', icon: CalendarClock, bg: 'bg-sky-200', items: upcoming, empty: 'No upcoming deadlines' },
  ] as const;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
      <Card className="flex flex-col items-center justify-center p-6">
        <div className="mb-2 flex items-center gap-2 self-start">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink-900 bg-lavender-200 shadow-neo-sm">
            <Target className="h-5 w-5 text-ink-900" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold text-ink-900">Daily Progress</h3>
            <p className="text-[11px] font-medium text-ink-700">Completion meter</p>
          </div>
        </div>
        <ProgressRing pct={completionPct} />
        <p className="mt-3 text-center text-[11px] font-semibold text-ink-700">
          {tasks.filter((t) => t.status === 'done').length} of {tasks.length} tasks done
        </p>
        {overdue.length > 0 && (
          <span className="mt-2 rounded-full border-2 border-ink-900 bg-rose-200 px-2.5 py-1 text-[11px] font-bold text-ink-900 shadow-neo-sm">{overdue.length} overdue</span>
        )}
      </Card>

      {sections.map((section) => {
        const Icon = section.icon;
        return (
          <Card key={section.key} className="flex flex-col p-5">
            <div className="mb-4 flex items-center gap-2">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink-900 ${section.bg} shadow-neo-sm`}>
                <Icon className="h-5 w-5 text-ink-900" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-sm font-bold text-ink-900">{section.label}</h3>
                <p className="text-[11px] font-medium text-ink-700">{section.items.length} {section.items.length === 1 ? 'item' : 'items'}</p>
              </div>
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto">
              {section.items.length === 0 ? (
                <div className="flex flex-col items-center gap-2 rounded-lg py-8 text-center">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink-900 bg-white text-ink-700">
                    <Icon className="h-4 w-4" strokeWidth={2.5} />
                  </div>
                  <p className="text-[11px] font-bold text-ink-700">{section.empty}</p>
                </div>
              ) : (
                section.items.map((task) => (
                  <TaskCard key={task.id} task={task} onToggle={onToggle} onEdit={onEdit} compact />
                ))
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
