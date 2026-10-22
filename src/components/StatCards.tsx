import { Clock, CheckCircle2, Flame, Gauge, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { StatCard } from '@/data/mock';
import { Card, Sparkline } from './ui';

const iconMap = { clock: Clock, check: CheckCircle2, flame: Flame, gauge: Gauge };
const bgMap: Record<string, string> = {
  accent: 'bg-sage-200',
  emerald: 'bg-sage-200',
  amber: 'bg-yellow-200',
  rose: 'bg-peach-200',
};
const sparkColorMap: Record<string, string> = {
  accent: '#4E9A6B',
  emerald: '#4E9A6B',
  amber: '#D9A900',
  rose: '#DD7B50',
};

export function StatCards({ stats }: { stats: StatCard[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, i) => {
        const Icon = iconMap[stat.icon];
        const color = sparkColorMap[stat.accent];
        const up = stat.change >= 0;
        return (
          <Card key={stat.id} delay={i * 60} className="group relative overflow-hidden p-5">
            <div className="flex items-start justify-between">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 border-ink-900 ${bgMap[stat.accent]} shadow-neo-sm`}>
                <Icon className="h-6 w-6 text-ink-900" strokeWidth={2.5} />
              </div>
              <div className={`flex items-center gap-1 rounded-full border-2 border-ink-900 px-2.5 py-1 text-xs font-bold shadow-neo-sm ${
                up ? 'bg-sage-300 text-ink-900' : 'bg-peach-300 text-ink-900'
              }`}>
                {up ? <ArrowUpRight className="h-3 w-3" strokeWidth={3} /> : <ArrowDownRight className="h-3 w-3" strokeWidth={3} />}
                {Math.abs(stat.change)}%
              </div>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-sm font-semibold text-ink-700">{stat.label}</p>
                <p className="mt-1 flex items-baseline gap-1 font-display text-3xl font-bold tracking-tight text-ink-900">
                  {stat.value}
                  {stat.unit && <span className="text-sm font-medium text-ink-700">{stat.unit}</span>}
                </p>
              </div>
              <Sparkline data={stat.trend} color={color ?? '#1A1A1A'} />
            </div>
            <p className="mt-3 text-[11px] font-medium text-ink-700">
              {up ? '+' : ''}{stat.change}% from last week
            </p>
          </Card>
        );
      })}
    </div>
  );
}
