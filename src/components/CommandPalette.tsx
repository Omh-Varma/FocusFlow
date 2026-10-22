import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, CornerDownLeft, Plus, LayoutDashboard, CalendarDays, ListTodo, BarChart3, Settings, Palette, Command } from 'lucide-react';
import { ViewKey, Task } from '@/data/mock';
import { useTheme } from '@/context/ThemeContext';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  setView: (v: ViewKey) => void;
  tasks: Task[];
  onNewTask: () => void;
}

interface CommandItem {
  id: string;
  label: string;
  hint?: string;
  icon: typeof Search;
  action: () => void;
  group: string;
}

export function CommandPalette({ open, onClose, setView, tasks, onNewTask }: CommandPaletteProps) {
  const { theme, setTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const baseCommands: CommandItem[] = useMemo(() => {
    const nav: { key: ViewKey; label: string; icon: typeof LayoutDashboard }[] = [
      { key: 'dashboard', label: 'Go to Dashboard', icon: LayoutDashboard },
      { key: 'schedule', label: 'Go to Schedule', icon: CalendarDays },
      { key: 'tasks', label: 'Go to Tasks', icon: ListTodo },
      { key: 'analytics', label: 'Go to Analytics', icon: BarChart3 },
      { key: 'settings', label: 'Go to Settings', icon: Settings },
    ];
    return [
      ...nav.map((n) => ({ id: `nav-${n.key}`, label: n.label, icon: n.icon, group: 'Navigation', action: () => { setView(n.key); onClose(); } })),
      { id: 'new-task', label: 'Create new task', hint: 'N', icon: Plus, group: 'Actions', action: () => { onNewTask(); onClose(); } },
      { id: 'theme-cream', label: 'Theme: Cream', icon: Palette, group: 'Actions', action: () => { setTheme('cream'); onClose(); } },
      { id: 'theme-sage', label: 'Theme: Sage', icon: Palette, group: 'Actions', action: () => { setTheme('sage'); onClose(); } },
      { id: 'theme-lavender', label: 'Theme: Lavender', icon: Palette, group: 'Actions', action: () => { setTheme('lavender'); onClose(); } },
    ];
  }, [setView, onClose, onNewTask, setTheme]);

  const taskCommands: CommandItem[] = useMemo(
    () => tasks.slice(0, 30).map((t) => ({
      id: `task-${t.id}`, label: t.title, hint: t.subject, icon: ListTodo, group: 'Tasks',
      action: () => { setView('tasks'); onClose(); },
    })),
    [tasks, setView, onClose]
  );

  const results = useMemo(() => {
    const all = query ? [...baseCommands, ...taskCommands] : baseCommands;
    if (!query) return all;
    const q = query.toLowerCase();
    return all.filter((c) => c.label.toLowerCase().includes(q) || c.hint?.toLowerCase().includes(q));
  }, [baseCommands, taskCommands, query]);

  useEffect(() => {
    if (open) { setQuery(''); setActiveIdx(0); setTimeout(() => inputRef.current?.focus(), 50); }
  }, [open]);

  useEffect(() => { setActiveIdx(0); }, [query]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, results.length - 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)); }
      if (e.key === 'Enter' && results[activeIdx]) { e.preventDefault(); results[activeIdx].action(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, results, activeIdx, onClose]);

  useEffect(() => {
    listRef.current?.querySelector(`[data-idx="${activeIdx}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [activeIdx]);

  if (!open) return null;

  const grouped = results.reduce<Record<string, CommandItem[]>>((acc, c) => { (acc[c.group] ??= []).push(c); return acc; }, {});
  let runningIdx = 0;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-ink-900/40 p-4 pt-[15vh]" onClick={onClose}>
      <div className="w-full max-w-xl animate-scale-in overflow-hidden rounded-2xl border-2 border-ink-900 bg-cream-50 shadow-neo-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b-2 border-ink-900 bg-white px-4">
          <Search className="h-5 w-5 text-ink-900" strokeWidth={2.5} />
          <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands and tasks..."
            className="flex-1 bg-transparent py-4 text-sm font-medium text-ink-900 placeholder:text-ink-700/50 focus:outline-none" />
          <kbd className="hidden rounded-md border-2 border-ink-900 bg-cream-100 px-1.5 py-0.5 text-[10px] font-bold text-ink-900 sm:block">ESC</kbd>
        </div>
        <div ref={listRef} className="max-h-[50vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink-900 bg-white text-ink-700">
                <Command className="h-5 w-5" strokeWidth={2.5} />
              </div>
              <p className="text-xs font-bold text-ink-700">No results for "{query}"</p>
            </div>
          ) : (
            Object.entries(grouped).map(([group, cmds]) => (
              <div key={group} className="mb-2">
                <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-ink-700">{group}</p>
                {cmds.map((cmd) => {
                  const idx = runningIdx++;
                  const active = idx === activeIdx;
                  return (
                    <button key={cmd.id} data-idx={idx} onMouseEnter={() => setActiveIdx(idx)} onClick={() => cmd.action()}
                      className={`flex w-full items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-left text-sm font-semibold transition-all ${
                        active ? 'border-ink-900 bg-yellow-200 text-ink-900 shadow-neo-sm' : 'border-transparent text-ink-700 hover:bg-cream-100'
                      }`}>
                      <cmd.icon className={`h-4 w-4 shrink-0 ${active ? 'text-ink-900' : 'text-ink-700'}`} strokeWidth={2.5} />
                      <span className="flex-1 truncate">{cmd.label}</span>
                      {cmd.hint && <span className="text-[10px] font-bold text-ink-700">{cmd.hint}</span>}
                      {active && <CornerDownLeft className="h-3.5 w-3.5 text-ink-900" strokeWidth={2.5} />}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
        <div className="flex items-center justify-between border-t-2 border-ink-900 bg-white px-4 py-2.5 text-[10px] font-bold text-ink-700">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><kbd className="rounded border-2 border-ink-900 bg-cream-100 px-1">↑↓</kbd> navigate</span>
            <span className="flex items-center gap-1"><kbd className="rounded border-2 border-ink-900 bg-cream-100 px-1">↵</kbd> select</span>
          </div>
          <span className="flex items-center gap-1"><Command className="h-3 w-3" strokeWidth={2.5} /> FocusFlow</span>
        </div>
      </div>
    </div>
  );
}
