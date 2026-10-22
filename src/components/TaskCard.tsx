import { Check, Pencil, GripVertical, AlertCircle } from 'lucide-react';
import { Task, Priority, isOverdue, isToday } from '@/data/mock';
import { PriorityDot, Badge } from './ui';

const priorityTone: Record<Priority, 'rose' | 'yellow' | 'sage'> = {
  high: 'rose',
  medium: 'yellow',
  low: 'sage',
};

interface TaskCardProps {
  task: Task;
  onToggle?: (id: string) => void;
  onEdit?: (task: Task) => void;
  draggable?: boolean;
  onDragStart?: (id: string) => void;
  onDragEnd?: () => void;
  isDragging?: boolean;
  compact?: boolean;
}

export function TaskCard({ task, onToggle, onEdit, draggable, onDragStart, onDragEnd, isDragging, compact }: TaskCardProps) {
  const overdue = isOverdue(task);
  const today = isToday(task);

  return (
    <div
      draggable={draggable}
      onDragStart={draggable ? (e) => { e.dataTransfer.setData('text/plain', task.id); onDragStart?.(task.id); } : undefined}
      onDragEnd={draggable ? onDragEnd : undefined}
      className={`group rounded-xl border-2 border-ink-900 bg-white p-3 shadow-neo-sm transition-all duration-150 hover:shadow-neo ${
        draggable ? 'cursor-grab active:cursor-grabbing' : ''
      } ${isDragging ? 'opacity-40 ring-2 ring-lavender-400' : ''}`}
    >
      <div className="flex items-start gap-2.5">
        {onToggle && (
          <button onClick={() => onToggle(task.id)}
            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-ink-900 transition-all duration-200 ${
              task.status === 'done' ? 'bg-sage-400 text-white' : 'bg-white hover:bg-cream-100'
            }`} aria-label="Toggle complete">
            {task.status === 'done' && <Check className="h-3 w-3" strokeWidth={3} />}
          </button>
        )}
        <div className="min-w-0 flex-1">
          <p className={`text-sm font-bold text-ink-900 ${task.status === 'done' ? 'line-through opacity-50' : ''}`}>{task.title}</p>
          {!compact && task.description && (
            <p className="mt-0.5 line-clamp-1 text-[11px] font-medium text-ink-700">{task.description}</p>
          )}
          {task.due && (
            <p className={`mt-0.5 flex items-center gap-1 text-[11px] font-semibold ${
              overdue ? 'text-rose-500' : today ? 'text-sky-500' : 'text-ink-700'
            }`}>
              {overdue && <AlertCircle className="h-3 w-3" strokeWidth={2.5} />}
              {overdue ? 'Overdue · ' : today ? 'Due today · ' : 'Due '}
              {new Date(task.due).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
          )}
        </div>
        {onEdit && (
          <button onClick={() => onEdit(task)}
            className="mt-0.5 shrink-0 rounded-lg border-2 border-ink-900 bg-cream-100 p-1 text-ink-900 opacity-0 transition-all duration-200 hover:bg-yellow-200 group-hover:opacity-100"
            aria-label="Edit task">
            <Pencil className="h-3.5 w-3.5" strokeWidth={2.5} />
          </button>
        )}
        {draggable && <GripVertical className="mt-0.5 h-4 w-4 shrink-0 text-ink-700 opacity-0 transition-opacity group-hover:opacity-100" strokeWidth={2.5} />}
      </div>
      <div className={`flex items-center justify-between ${onToggle ? 'pl-7' : ''} ${compact ? 'mt-1.5' : 'mt-2.5'}`}>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase text-ink-700">{task.subject}</span>
          <Badge tone={priorityTone[task.priority]}>
            <PriorityDot priority={task.priority} />{task.priority}
          </Badge>
        </div>
      </div>
    </div>
  );
}
