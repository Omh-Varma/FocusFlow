import { weeklyActivity, subjectBreakdown } from '@/data/mock';
import { Card } from './ui';

const barColors = ['#8FCBA3', '#FFDB4D', '#B69FE0', '#5AABE6', '#EFB095', '#DD7B50', '#6BB386'];

export function AnalyticsView() {
  const maxFocus = Math.max(...weeklyActivity.map((d) => d.focus));
  const totalHours = subjectBreakdown.reduce((s, x) => s + x.hours, 0);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl font-bold text-ink-900">Analytics</h2>
        <p className="text-sm font-medium text-ink-700">Your study patterns over the past week</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Weekly activity bar chart */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="font-display mb-1 text-sm font-bold text-ink-900">Weekly Focus Hours</h3>
          <p className="mb-6 text-[11px] font-medium text-ink-700">Hours spent in deep work per day</p>
          <div className="flex h-48 items-end justify-between gap-3">
            {weeklyActivity.map((d, i) => (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                <div className="relative flex w-full flex-1 items-end">
                  <div
                    className="group relative w-full rounded-t-lg border-2 border-ink-900 transition-all duration-300 hover:-translate-y-1"
                    style={{
                      height: `${(d.focus / maxFocus) * 100}%`,
                      backgroundColor: barColors[i % barColors.length],
                      animation: `scale-in 0.4s ease-out ${i * 60}ms both`,
                      transformOrigin: 'bottom',
                    }}
                  >
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 rounded border-2 border-ink-900 bg-white px-1.5 py-0.5 text-[10px] font-bold text-ink-900 opacity-0 shadow-neo-sm transition-opacity group-hover:opacity-100">
                      {d.focus}h
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-ink-700">{d.day}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Subject breakdown */}
        <Card className="p-6">
          <h3 className="font-display mb-1 text-sm font-bold text-ink-900">Time by Subject</h3>
          <p className="mb-5 text-[11px] font-medium text-ink-700">{totalHours.toFixed(1)} hours total</p>
          <div className="space-y-4">
            {subjectBreakdown.map((s) => {
              const pct = (s.hours / totalHours) * 100;
              return (
                <div key={s.subject}>
                  <div className="mb-1.5 flex items-center justify-between text-xs font-bold">
                    <span className="text-ink-900">{s.subject}</span>
                    <span className="text-ink-700">{s.hours}h</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full border-2 border-ink-900 bg-cream-100">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: s.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'Total focus this week', value: '24.7h', sub: 'across 5 days', bg: 'bg-sage-200' },
          { label: 'Tasks completed', value: '35', sub: '12 above target', bg: 'bg-peach-200' },
          { label: 'Avg. session length', value: '42m', sub: '+6m vs last week', bg: 'bg-lavender-200' },
        ].map((s, i) => (
          <Card key={s.label} delay={i * 60} className={`p-5 ${s.bg}`}>
            <p className="text-sm font-semibold text-ink-700">{s.label}</p>
            <p className="font-display mt-2 text-3xl font-bold text-ink-900">{s.value}</p>
            <p className="mt-1 text-[11px] font-medium text-ink-700">{s.sub}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
