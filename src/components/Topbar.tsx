import { Menu, Bell, Plus, Command } from 'lucide-react';
import { ViewKey } from '@/data/mock';

const titles: Record<ViewKey, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Your study overview at a glance' },
  schedule: { title: 'Schedule', subtitle: 'Plan your week ahead' },
  tasks: { title: 'Tasks', subtitle: 'Track everything on your plate' },
  analytics: { title: 'Analytics', subtitle: 'Insights into your study habits' },
  settings: { title: 'Settings', subtitle: 'Tune your workspace' },
};

interface TopbarProps {
  view: ViewKey;
  onMenu: () => void;
  onOpenPalette: () => void;
  onQuickAdd: () => void;
}

export function Topbar({ view, onMenu, onOpenPalette, onQuickAdd }: TopbarProps) {
  const { title, subtitle } = titles[view];
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b-2 border-ink-900 bg-cream-50/90 px-4 backdrop-blur-md lg:px-6">
      <button onClick={onMenu} className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-ink-900 bg-white shadow-neo-sm transition-all hover:bg-cream-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none lg:hidden">
        <Menu className="h-5 w-5 text-ink-900" />
      </button>
      <div className="min-w-0 flex-1">
        <h1 className="font-display truncate text-lg font-bold text-ink-900">{title}</h1>
        <p className="truncate text-[11px] font-medium text-ink-700">{subtitle}</p>
      </div>
      <button onClick={onOpenPalette}
        className="flex items-center gap-2 rounded-xl border-2 border-ink-900 bg-white px-3 py-2 text-sm font-semibold text-ink-700 shadow-neo-sm transition-all hover:bg-cream-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        title="Search · ⌘K">
        <Command className="h-4 w-4" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden rounded border-2 border-ink-900 bg-cream-100 px-1.5 py-0.5 text-[10px] font-bold text-ink-900 sm:block">⌘K</kbd>
      </button>
      <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border-2 border-ink-900 bg-white shadow-neo-sm transition-all hover:bg-cream-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none">
        <Bell className="h-[18px] w-[18px] text-ink-900" />
        <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-ink-900 bg-peach-400" />
      </button>
      <button onClick={onQuickAdd}
        className="hidden items-center gap-1.5 rounded-xl border-2 border-ink-900 bg-yellow-300 px-4 py-2 text-sm font-bold text-ink-900 shadow-neo-sm transition-all hover:bg-yellow-200 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none sm:flex">
        <Plus className="h-4 w-4" strokeWidth={2.5} />Quick add
      </button>
    </header>
  );
}
