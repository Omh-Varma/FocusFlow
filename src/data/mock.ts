export type Priority = 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type ViewKey = 'dashboard' | 'schedule' | 'tasks' | 'analytics' | 'settings';

export interface Task {
  id: string;
  title: string;
  description?: string;
  subject: string;
  priority: Priority;
  status: TaskStatus;
  due?: string; // ISO date
  createdAt: number;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  type: 'class' | 'deadline' | 'study' | 'exam';
  start: string; // ISO
  end?: string;
  location?: string;
  status: 'upcoming' | 'live' | 'done';
}

export interface StatCard {
  id: string;
  label: string;
  value: string;
  unit?: string;
  change: number; // percent
  trend: number[]; // sparkline points
  icon: 'clock' | 'check' | 'flame' | 'gauge';
  accent: 'accent' | 'emerald' | 'amber' | 'rose';
}

export const SUBJECTS = ['Math 201', 'CS 340', 'PHYS 122', 'LANG 110', 'Personal'];

export const initialTasks: Task[] = [
  { id: 't1', title: 'Linear Algebra — Problem Set 4', description: 'Eigenvalues, eigenvectors, diagonalization', subject: 'Math 201', priority: 'high', status: 'todo', due: '2026-10-22', createdAt: Date.now() - 86400000 * 2 },
  { id: 't2', title: 'Read Chapter 7 — Designing Data-Intensive Apps', subject: 'CS 340', priority: 'medium', status: 'todo', due: '2026-10-24', createdAt: Date.now() - 86400000 },
  { id: 't3', title: 'Lab Report: Oscilloscope Measurements', subject: 'PHYS 122', priority: 'high', status: 'in-progress', due: '2026-10-21', createdAt: Date.now() - 86400000 * 3 },
  { id: 't4', title: 'Group project standup notes', subject: 'CS 340', priority: 'low', status: 'in-progress', createdAt: Date.now() - 3600000 },
  { id: 't5', title: 'Review lecture notes: Fourier transforms', subject: 'PHYS 122', priority: 'medium', status: 'done', createdAt: Date.now() - 86400000 * 4 },
  { id: 't6', title: 'Submit scholarship application essay', subject: 'Personal', priority: 'high', status: 'done', createdAt: Date.now() - 86400000 * 5 },
  { id: 't7', title: 'Flashcards — German vocabulary', subject: 'LANG 110', priority: 'low', status: 'todo', due: '2026-10-25', createdAt: Date.now() - 7200000 },
  { id: 't8', title: 'Draft research paper outline', subject: 'CS 340', priority: 'medium', status: 'done', createdAt: Date.now() - 86400000 * 6 },
];

export const initialSchedule: ScheduleEvent[] = [
  { id: 'e1', title: 'Algorithms & Data Structures', type: 'class', start: '2026-10-21T09:00:00', end: '2026-10-21T10:30:00', location: 'Science Hall 204', status: 'done' },
  { id: 'e2', title: 'Linear Algebra Lecture', type: 'class', start: '2026-10-21T11:00:00', end: '2026-10-21T12:30:00', location: 'Whitman 110', status: 'live' },
  { id: 'e3', title: 'Study session — Group project', type: 'study', start: '2026-10-21T13:30:00', end: '2026-10-21T15:00:00', location: 'Library, Room 3B', status: 'upcoming' },
  { id: 'e4', title: 'Physics Lab Report due', type: 'deadline', start: '2026-10-21T23:59:00', status: 'upcoming' },
  { id: 'e5', title: 'Midterm: CS 340', type: 'exam', start: '2026-10-22T10:00:00', end: '2026-10-22T12:00:00', location: 'Science Hall 204', status: 'upcoming' },
  { id: 'e6', title: 'German Conversation Practice', type: 'class', start: '2026-10-23T14:00:00', end: '2026-10-23T15:30:00', location: 'Online', status: 'upcoming' },
];

export const initialStats: StatCard[] = [
  { id: 's1', label: 'Focus Time Today', value: '3h 24m', change: 12, trend: [2, 3, 2.5, 4, 3.5, 4.2, 3.4], icon: 'clock', accent: 'accent' },
  { id: 's2', label: 'Tasks Completed', value: '7', unit: 'tasks', change: 8, trend: [3, 4, 5, 4, 6, 5, 7], icon: 'check', accent: 'emerald' },
  { id: 's3', label: 'Current Streak', value: '12', unit: 'days', change: 20, trend: [4, 5, 6, 7, 9, 11, 12], icon: 'flame', accent: 'amber' },
  { id: 's4', label: 'Productivity Score', value: '86', unit: '/100', change: -4, trend: [78, 82, 90, 84, 88, 92, 86], icon: 'gauge', accent: 'rose' },
];

export const weeklyActivity = [
  { day: 'Mon', focus: 4.2, tasks: 6 },
  { day: 'Tue', focus: 3.8, tasks: 4 },
  { day: 'Wed', focus: 5.1, tasks: 8 },
  { day: 'Thu', focus: 2.4, tasks: 3 },
  { day: 'Fri', focus: 4.6, tasks: 7 },
  { day: 'Sat', focus: 1.2, tasks: 2 },
  { day: 'Sun', focus: 3.4, tasks: 5 },
];

export const subjectBreakdown = [
  { subject: 'Math 201', hours: 11.5, color: '#6366f1' },
  { subject: 'CS 340', hours: 9.2, color: '#10b981' },
  { subject: 'PHYS 122', hours: 7.8, color: '#f59e0b' },
  { subject: 'LANG 110', hours: 3.4, color: '#f43f5e' },
];

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function isOverdue(task: Task): boolean {
  if (!task.due || task.status === 'done') return false;
  return task.due < todayISO();
}

export function isToday(task: Task): boolean {
  return task.due === todayISO();
}

export function isUpcoming(task: Task): boolean {
  if (!task.due) return false;
  return task.due > todayISO();
}
