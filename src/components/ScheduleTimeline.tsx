import { CalendarDays, Clock, MapPin, BookOpen, FileText, GraduationCap, AlertTriangle } from 'lucide-react';
import { ScheduleEvent } from '@/data/mock';
import { Card, Badge } from './ui';

const typeMeta: Record<ScheduleEvent['type'], { icon: typeof BookOpen; tone: 'sage' | 'peach' | 'yellow' | 'lavender' | 'sky' | 'rose'; bg: string; label: string }> = {
  class: { icon: BookOpen, tone: 'sky', bg: 'bg-sky-200', label: 'Class' },
  deadline: { icon: AlertTriangle, tone: 'rose', bg: 'bg-rose-200', label: 'Deadline' },
  study: { icon: GraduationCap, tone: 'sage', bg: 'bg-sage-200', label: 'Study' },
  exam: { icon: FileText, tone: 'peach', bg: 'bg-peach-200', label: 'Exam' },
};

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export function ScheduleTimeline({ events }: { events: ScheduleEvent[] }) {
  const sorted = [...events].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  return (
    <Card className="p-5">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink-900 bg-sky-200 shadow-neo-sm">
            <CalendarDays className="h-5 w-5 text-ink-900" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold text-ink-900">Today's Schedule</h3>
            <p className="text-[11px] font-medium text-ink-700">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
        <Badge tone="sky">{sorted.length} events</Badge>
      </div>

      <div className="relative">
        {/* timeline rail */}
        <div className="absolute left-[18px] top-2 bottom-2 w-0.5 border-l-2 border-dashed border-ink-900/30" />
        <div className="space-y-3">
          {sorted.map((ev, i) => {
            const meta = typeMeta[ev.type];
            const Icon = meta.icon;
            return (
              <div
                key={ev.id}
                className="group relative flex gap-3.5"
                style={{ animation: `slide-in-right 0.4s ease-out ${i * 50}ms both` }}
              >
                <div className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-ink-900 ${meta.bg} shadow-neo-sm`}>
                  <Icon className="h-4 w-4 text-ink-900" strokeWidth={2.5} />
                  {ev.status === 'live' && (
                    <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-ink-900 bg-rose-400 animate-pulse" />
                  )}
                </div>
                <div className={`flex-1 rounded-xl border-2 border-ink-900 ${meta.bg} p-3 shadow-neo-sm transition-all hover:shadow-neo`}>
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-bold text-ink-900 ${ev.status === 'done' ? 'line-through opacity-50' : ''}`}>
                      {ev.title}
                    </p>
                    {ev.status === 'live' && <Badge tone="rose">Live</Badge>}
                    {ev.status === 'done' && <Badge tone="sage">Done</Badge>}
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold text-ink-900">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" strokeWidth={2.5} />
                      {fmtTime(ev.start)}{ev.end ? ` – ${fmtTime(ev.end)}` : ''}
                    </span>
                    {ev.location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" strokeWidth={2.5} />
                        {ev.location}
                      </span>
                    )}
                    <Badge tone={meta.tone}>{meta.label}</Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
