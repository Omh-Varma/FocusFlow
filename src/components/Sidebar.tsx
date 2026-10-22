import { LayoutDashboard, CalendarDays, ListTodo, BarChart3, Settings, ChevronLeft, GraduationCap, LogOut, Command } from 'lucide-react';
import { ViewKey } from '@/data/mock';
import { useTheme } from '@/context/ThemeContext';

interface SidebarProps {
  view: ViewKey;
  setView: (v: ViewKey) => void;
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (o: boolean) => void;
  onOpenPalette: () => void;
}

const navItems: { key: ViewKey; label: string; icon: typeof LayoutDashboard; bg: string }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, bg: 'bg-yellow-200' },
  { key: 'schedule', label: 'Schedule', icon: CalendarDays, bg: 'bg-sky-200' },
  { key: 'tasks', label: 'Tasks', icon: ListTodo, bg: 'bg-peach-200' },
  { key: 'analytics', label: 'Analytics', icon: BarChart3, bg: 'bg-sage-200' },
  { key: 'settings', label: 'Settings', icon: Settings, bg: 'bg-lavender-200' },
];

export function Sidebar({ view, setView, collapsed, setCollapsed, mobileOpen, setMobileOpen, onOpenPalette }: SidebarProps) {
  const { theme, setTheme } = useTheme();

  const handleNav = (key: ViewKey) => {
    setView(key);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-30 bg-ink-900/40 transition-opacity duration-300 lg:hidden ${
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setMobileOpen(false)}
      />

      <aside
        className={`fixed z-40 flex h-screen flex-col border-r-2 border-ink-900 bg-cream-50 transition-all duration-300 ease-out lg:sticky lg:top-0 lg:z-20 ${
          collapsed ? 'lg:w-[76px]' : 'lg:w-[252px]'
        } w-[262px] ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand */}
        <div className="flex h-16 items-center gap-3 px-4">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-ink-900 bg-yellow-300 shadow-neo-sm">
            <GraduationCap className="h-5 w-5 text-ink-900" strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="font-display text-base font-bold tracking-tight text-ink-900">FocusFlow</p>
              <p className="text-[11px] font-medium text-ink-700">Student Workspace</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-ink-900 bg-white shadow-neo-sm transition-all hover:bg-cream-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none lg:flex"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className={`h-4 w-4 text-ink-900 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Command palette trigger */}
        {!collapsed && (
          <div className="px-3 pb-2">
            <button
              onClick={onOpenPalette}
              className="flex w-full items-center gap-2 rounded-xl border-2 border-ink-900 bg-white px-3 py-2 text-xs font-semibold text-ink-700 shadow-neo-sm transition-all hover:bg-cream-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              <Command className="h-3.5 w-3.5" />
              <span className="flex-1 text-left">Quick search</span>
              <kbd className="rounded border-2 border-ink-900 bg-cream-100 px-1.5 py-0.5 text-[9px] font-bold">⌘K</kbd>
            </button>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 space-y-2 px-3 py-2">
          {!collapsed && <p className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-ink-700">Workspace</p>}
          {navItems.map(({ key, label, icon: Icon, bg }) => {
            const active = view === key;
            return (
              <button
                key={key}
                onClick={() => handleNav(key)}
                title={collapsed ? label : undefined}
                className={`group flex w-full items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-sm font-bold transition-all duration-150 no-tap-highlight ${
                  active
                    ? `${bg} border-ink-900 text-ink-900 shadow-neo-sm`
                    : 'border-transparent text-ink-700 hover:border-ink-900 hover:bg-white hover:shadow-neo-sm'
                } ${collapsed ? 'lg:justify-center lg:px-0' : ''}`}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2.5} />
                {!collapsed && <span className="truncate">{label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Theme picker */}
        <div className="px-3 pb-2">
          {!collapsed ? (
            <div className="flex items-center gap-2 rounded-xl border-2 border-ink-900 bg-white p-2 shadow-neo-sm">
              <span className="px-1 text-[10px] font-bold uppercase text-ink-700">Theme</span>
              {(['cream', 'sage', 'lavender'] as const).map((t) => {
                const bg = t === 'cream' ? 'bg-yellow-200' : t === 'sage' ? 'bg-sage-200' : 'bg-lavender-200';
                return (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`h-6 w-6 rounded-full border-2 border-ink-900 ${bg} transition-all hover:scale-110 ${
                      theme === t ? 'ring-2 ring-ink-900 ring-offset-1' : ''
                    }`}
                    title={`${t} theme`}
                  />
                );
              })}
            </div>
          ) : (
            <button
              onClick={() => setTheme(theme === 'cream' ? 'sage' : theme === 'sage' ? 'lavender' : 'cream')}
              className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg border-2 border-ink-900 bg-yellow-200 shadow-neo-sm"
            >
              <span className="text-xs">🎨</span>
            </button>
          )}
        </div>

        {/* Profile */}
        <div className="border-t-2 border-ink-900 p-3">
          <div className={`flex items-center gap-3 rounded-xl border-2 border-ink-900 bg-white p-2 shadow-neo-sm ${collapsed ? 'lg:justify-center' : ''}`}>
            <div className="relative shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink-900 bg-peach-200 text-sm font-bold text-ink-900">
                AM
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-ink-900 bg-sage-400" />
            </div>
            {!collapsed && (
              <div className="flex min-w-0 flex-1 items-center justify-between">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-ink-900">Avery Moore</p>
                  <p className="truncate text-[11px] font-medium text-ink-700">avery@university.edu</p>
                </div>
                <button className="rounded-lg p-1 text-ink-700 transition-colors hover:bg-cream-100">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
