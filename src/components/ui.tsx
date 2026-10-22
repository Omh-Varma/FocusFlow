import { ReactNode } from 'react';

export function Sparkline({ data, color = '#1A1A1A', width = 72, height = 28 }: { data: number[]; color?: string; width?: number; height?: number }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return [x, y] as const;
  });
  const path = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const area = `${path} L${width},${height} L0,${height} Z`;
  const gid = `spark-${color.replace('#', '')}`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1]?.[0] ?? 0} cy={pts[pts.length - 1]?.[1] ?? 0} r="3" fill="#1A1A1A" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

export function Card({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <div
      className={`neo-card ${className}`}
      style={{ animation: `fade-in 0.4s ease-out ${delay}ms both` }}
    >
      {children}
    </div>
  );
}

export type BadgeTone = 'sage' | 'peach' | 'yellow' | 'lavender' | 'sky' | 'rose' | 'ink';

export function Badge({ children, tone = 'ink' }: { children: ReactNode; tone?: BadgeTone }) {
  const tones: Record<BadgeTone, string> = {
    sage: 'bg-sage-200 text-ink-900',
    peach: 'bg-peach-200 text-ink-900',
    yellow: 'bg-yellow-200 text-ink-900',
    lavender: 'bg-lavender-200 text-ink-900',
    sky: 'bg-sky-200 text-ink-900',
    rose: 'bg-rose-200 text-ink-900',
    ink: 'bg-ink-900 text-white',
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border-2 border-ink-900 px-2.5 py-0.5 text-xs font-semibold shadow-neo-sm ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function PriorityDot({ priority }: { priority: 'high' | 'medium' | 'low' }) {
  const map = {
    high: 'bg-rose-400',
    medium: 'bg-yellow-300',
    low: 'bg-sage-300',
  };
  return <span className={`inline-block h-2.5 w-2.5 rounded-full border-2 border-ink-900 ${map[priority]}`} />;
}
