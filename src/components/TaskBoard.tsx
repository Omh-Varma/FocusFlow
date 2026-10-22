import { useMemo, useState } from 'react';
import { Plus, ListTodo, Flag } from 'lucide-react';
import { Task, Priority, TaskStatus, SUBJECTS } from '@/data/mock';
import { Card } from './ui';
import { TaskCard } from './TaskCard';

interface TaskBoardProps {
  tasks: Task[];
  onToggleDone: (id: string) => void;
  onEditTask: (task: Task) => void;
  onNewTask: () => void;
  onMoveTask: (id: string, status: TaskStatus) => void;
}

const columns: { key: TaskStatus; label: string; bg: string; dot: string }[] = [
  { key: 'todo', label: 'To Do', bg: 'bg-sky-100', dot: 'bg-sky-400' },
  { key: 'in-progress', label: 'In Progress', bg: 'bg-yellow-100', dot: 'bg-yellow-400' },
  { key: 'done', label: 'Done', bg: 'bg-sage-100', dot: 'bg-sage-400' },
];

export function TaskBoard({ tasks, onToggleDone, onEditTask, onNewTask, onMoveTask }: TaskBoardProps) {
  const [priorityFilter, setPriorityFilter] = useState<'all' | Priority>('all');
  const [subjectFilter, setSubjectFilter] = useState<'all' | string>('all');
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<TaskStatus | null>(null);

  const filtered = useMemo(
    () =>
      tasks.filter((t) => {
        if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
        if (subjectFilter !== 'all' && t.subject !== subjectFilter) return false;
        return true;
      }),
    [tasks, priorityFilter, subjectFilter]
  );

  const handleDrop = (status: TaskStatus, e: React.DragEvent) => {
    e.preventDefault();
    const id = dragId ?? e.dataTransfer.getData('text/plain');
    if (id) onMoveTask(id, status);
    setDragId(null);
    setDragOver(null);
  };

  const priorityButtons: ('all' | Priority)[] = ['all', 'high', 'medium', 'low'];

  return (
    <Card className="p-5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink-900 bg-peach-200 shadow-neo-sm">
            <ListTodo className="h-5 w-5 text-ink-900" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold text-ink-900">Tasks</h3>
            <p className="text-[11px] font-medium text-ink-700">{filtered.length} items</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}
            className="cursor-pointer rounded-lg border-2 border-ink-900 bg-white px-2.5 py-1.5 text-xs font-bold text-ink-900 shadow-neo-sm transition-all focus:outline-none">
            <option value="all">All subjects</option>
            {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="flex gap-1.5 rounded-xl border-2 border-ink-900 bg-white p-1 shadow-neo-sm">
            {priorityButtons.map((f) => (
              <button key={f} onClick={() => setPriorityFilter(f)}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold capitalize transition-all ${
                  priorityFilter === f ? 'bg-ink-900 text-white' : 'text-ink-700 hover:bg-cream-100'
                }`}>
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>
          <button onClick={onNewTask}
            className="flex items-center gap-1.5 rounded-xl border-2 border-ink-900 bg-yellow-300 px-3 py-1.5 text-xs font-bold text-ink-900 shadow-neo-sm transition-all hover:bg-yellow-200 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none">
            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />New task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {columns.map((col) => {
          const colTasks = filtered.filter((t) => t.status === col.key);
          return (
            <div key={col.key}
              onDragOver={(e) => { e.preventDefault(); setDragOver(col.key); }}
              onDragLeave={() => setDragOver((c) => (c === col.key ? null : c))}
              onDrop={(e) => handleDrop(col.key, e)}
              className={`flex flex-col gap-2 rounded-xl border-2 border-ink-900 p-3 transition-all duration-200 ${
                dragOver === col.key ? 'ring-2 ring-lavender-400 ring-offset-2' : ''
              } ${col.bg}`}>
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className={`h-3 w-3 rounded-full border-2 border-ink-900 ${col.dot}`} />
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-900">{col.label}</span>
                </div>
                <span className="rounded-full border-2 border-ink-900 bg-white px-2 py-0.5 text-xs font-bold text-ink-900">{colTasks.length}</span>
              </div>
              {colTasks.length === 0 ? (
                <div className="flex flex-col items-center gap-2 rounded-lg py-8 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink-900 bg-white text-ink-700">
                    <Flag className="h-4 w-4" strokeWidth={2.5} />
                  </div>
                  <p className="text-[11px] font-bold text-ink-700">{dragOver === col.key ? 'Drop here' : 'No tasks here'}</p>
                </div>
              ) : (
                colTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onToggle={onToggleDone} onEdit={onEditTask}
                    draggable onDragStart={(id) => setDragId(id)} onDragEnd={() => { setDragId(null); setDragOver(null); }}
                    isDragging={dragId === task.id} />
                ))
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
