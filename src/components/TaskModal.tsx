import { useEffect, useRef, useState } from 'react';
import { X, Trash2, Check } from 'lucide-react';
import { Task, Priority, SUBJECTS } from '@/data/mock';
import { PriorityDot } from './ui';

export interface TaskDraft {
  title: string;
  subject: string;
  priority: Priority;
  due?: string;
  description?: string;
}

interface TaskModalProps {
  open: boolean;
  initial?: Task | null;
  onClose: () => void;
  onSave: (draft: TaskDraft, id?: string) => void;
  onDelete?: (id: string) => void;
}

const emptyDraft: TaskDraft = { title: '', subject: SUBJECTS[0] ?? 'Personal', priority: 'medium', due: '', description: '' };

export function TaskModal({ open, initial, onClose, onSave, onDelete }: TaskModalProps) {
  const [draft, setDraft] = useState<TaskDraft>(emptyDraft);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setDraft(
        initial
          ? { title: initial.title, subject: initial.subject, priority: initial.priority, due: initial.due ?? '', description: initial.description ?? '' }
          : emptyDraft
      );
      setTimeout(() => titleRef.current?.focus(), 60);
    }
  }, [open, initial]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSave();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, draft, initial]);

  if (!open) return null;

  function handleSave() {
    if (!draft.title.trim()) return;
    onSave({ ...draft, title: draft.title.trim() }, initial?.id);
    onClose();
  }

  const inputCls =
    'w-full rounded-xl border-2 border-ink-900 bg-white px-3.5 py-2.5 text-sm font-medium text-ink-900 placeholder:text-ink-700/50 transition-all focus:outline-none focus:ring-2 focus:ring-yellow-300';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 p-4" onClick={onClose}>
      <div className="w-full max-w-lg animate-scale-in rounded-2xl border-2 border-ink-900 bg-cream-50 p-6 shadow-neo-lg" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-ink-900">{initial ? 'Edit task' : 'New task'}</h3>
          <button onClick={onClose} className="rounded-lg border-2 border-ink-900 bg-white p-1.5 text-ink-900 shadow-neo-sm transition-all hover:bg-cream-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none">
            <X className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-ink-700">Title</label>
            <input ref={titleRef} value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && !e.metaKey && !e.ctrlKey && handleSave()}
              placeholder="What do you need to do?" className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-ink-700">Subject</label>
              <select value={draft.subject} onChange={(e) => setDraft((d) => ({ ...d, subject: e.target.value }))}
                className={`${inputCls} cursor-pointer appearance-none`}>
                {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-ink-700">Deadline</label>
              <input type="date" value={draft.due ?? ''} onChange={(e) => setDraft((d) => ({ ...d, due: e.target.value }))}
                className={`${inputCls} cursor-pointer`} />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold text-ink-700">Priority</label>
            <div className="flex gap-2">
              {(['high', 'medium', 'low'] as Priority[]).map((p) => (
                <button key={p} onClick={() => setDraft((d) => ({ ...d, priority: p }))}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border-2 px-3 py-2 text-xs font-bold capitalize transition-all ${
                    draft.priority === p
                      ? p === 'high' ? 'bg-rose-200 border-ink-900 text-ink-900 shadow-neo-sm'
                        : p === 'medium' ? 'bg-yellow-200 border-ink-900 text-ink-900 shadow-neo-sm'
                        : 'bg-sage-200 border-ink-900 text-ink-900 shadow-neo-sm'
                      : 'border-ink-900 bg-white text-ink-700 hover:bg-cream-100'
                  }`}>
                  <PriorityDot priority={p} />{p}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-ink-700">Notes (optional)</label>
            <textarea value={draft.description ?? ''} onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
              placeholder="Add any details..." rows={2} className={`${inputCls} resize-none`} />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div>
            {initial && onDelete && (
              <button onClick={() => { onDelete(initial.id); onClose(); }}
                className="flex items-center gap-1.5 rounded-xl border-2 border-ink-900 bg-rose-200 px-3 py-2 text-sm font-bold text-ink-900 shadow-neo-sm transition-all hover:bg-rose-300 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none">
                <Trash2 className="h-4 w-4" strokeWidth={2.5} />Delete
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="rounded-xl border-2 border-ink-900 bg-white px-3.5 py-2 text-sm font-bold text-ink-700 shadow-neo-sm transition-all hover:bg-cream-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none">Cancel</button>
            <button onClick={handleSave}
              className="flex items-center gap-1.5 rounded-xl border-2 border-ink-900 bg-sage-300 px-4 py-2 text-sm font-bold text-ink-900 shadow-neo-sm transition-all hover:bg-sage-400 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none">
              <Check className="h-4 w-4" strokeWidth={2.5} />{initial ? 'Save' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
