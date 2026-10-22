import { useCallback, useEffect, useState } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { StatCards } from '@/components/StatCards';
import { PomodoroTimer } from '@/components/PomodoroTimer';
import { TaskBoard } from '@/components/TaskBoard';
import { ScheduleTimeline } from '@/components/ScheduleTimeline';
import { AnalyticsView } from '@/components/AnalyticsView';
import { SettingsView } from '@/components/SettingsView';
import { DailyOverview } from '@/components/DailyOverview';
import { CommandPalette } from '@/components/CommandPalette';
import { TaskModal, TaskDraft } from '@/components/TaskModal';
import { ViewKey, Task, TaskStatus, initialTasks, initialStats, initialSchedule } from '@/data/mock';

function App() {
  return (
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  );
}

function Dashboard() {
  const [view, setView] = useState<ViewKey>('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tasks, setTasks] = useLocalStorage<Task[]>('ff-tasks', initialTasks);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const openNewTask = useCallback(() => {
    setEditingTask(null);
    setModalOpen(true);
  }, []);

  const openEditTask = useCallback((task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  }, []);

  const toggleDone = useCallback((id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: t.status === 'done' ? 'todo' : 'done' } : t)));
  }, [setTasks]);

  const moveTask = useCallback((id: string, status: TaskStatus) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  }, [setTasks]);

  const saveTask = useCallback((draft: TaskDraft, id?: string) => {
    if (id) {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...draft } : t)));
    } else {
      const newTask: Task = {
        id: `t${Date.now()}`,
        title: draft.title,
        subject: draft.subject,
        priority: draft.priority,
        status: 'todo',
        createdAt: Date.now(),
      };
      if (draft.due) newTask.due = draft.due;
      if (draft.description) newTask.description = draft.description;
      setTasks((prev) => [newTask, ...prev]);
    }
  }, [setTasks]);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, [setTasks]);

  // Keyboard shortcuts: ⌘K palette, N new task
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((o) => !o);
        return;
      }
      const target = e.target as HTMLElement;
      const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable;
      if (isTyping || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        openNewTask();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openNewTask]);

  const taskBoard = (
    <TaskBoard
      tasks={tasks}
      onToggleDone={toggleDone}
      onEditTask={openEditTask}
      onNewTask={openNewTask}
      onMoveTask={moveTask}
    />
  );

  return (
    <div className="min-h-screen text-ink-900">
      <div className="relative flex">
        <Sidebar
          view={view}
          setView={setView}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          onOpenPalette={() => setPaletteOpen(true)}
        />

        <div className="flex min-h-screen flex-1 flex-col">
          <Topbar
            view={view}
            onMenu={() => setMobileOpen(true)}
            onOpenPalette={() => setPaletteOpen(true)}
            onQuickAdd={openNewTask}
          />

          <main className="flex-1 px-4 py-6 lg:px-8">
            {view === 'dashboard' && (
              <div className="mx-auto max-w-[1400px] space-y-6">
                <StatCards stats={initialStats} />
                <DailyOverview tasks={tasks} onToggle={toggleDone} onEdit={openEditTask} />
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                  <div className="xl:col-span-1">
                    <PomodoroTimer />
                  </div>
                  <div className="xl:col-span-2">
                    <ScheduleTimeline events={initialSchedule} />
                  </div>
                </div>
                {taskBoard}
              </div>
            )}

            {view === 'schedule' && (
              <div className="mx-auto max-w-[1400px]">
                <ScheduleTimeline events={initialSchedule} />
              </div>
            )}

            {view === 'tasks' && (
              <div className="mx-auto max-w-[1400px]">
                {taskBoard}
              </div>
            )}

            {view === 'analytics' && (
              <div className="mx-auto max-w-[1400px]">
                <AnalyticsView />
              </div>
            )}

            {view === 'settings' && (
              <div className="mx-auto max-w-[1400px]">
                <SettingsView />
              </div>
            )}
          </main>
        </div>
      </div>

      <TaskModal
        open={modalOpen}
        initial={editingTask}
        onClose={() => setModalOpen(false)}
        onSave={saveTask}
        onDelete={deleteTask}
      />

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        setView={setView}
        tasks={tasks}
        onNewTask={openNewTask}
      />
    </div>
  );
}

export default App;
