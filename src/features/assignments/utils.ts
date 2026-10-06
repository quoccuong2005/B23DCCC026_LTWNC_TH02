import type { Assignment, AssignmentStats } from './types';

const dayInMs = 24 * 60 * 60 * 1000;

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

export function isOverdue(
  dueDate: string,
  completed: boolean,
  now: Date = new Date(),
): boolean {
  return !completed && startOfDay(new Date(`${dueDate}T00:00:00`)) < startOfDay(now);
}

export function calcDaysLeft(dueDate: string, now: Date = new Date()): number {
  return Math.round(
    (startOfDay(new Date(`${dueDate}T00:00:00`)) - startOfDay(now)) / dayInMs,
  );
}

export function calcStats(assignments: Assignment[], now: Date = new Date()): AssignmentStats {
  return assignments.reduce<AssignmentStats>(
    (stats, assignment) => {
      stats.total += 1;
      if (assignment.completed) stats.completed += 1;
      if (isOverdue(assignment.dueDate, assignment.completed, now)) stats.overdue += 1;
      stats.bySubject[assignment.subject] = (stats.bySubject[assignment.subject] ?? 0) + 1;
      return stats;
    },
    { total: 0, completed: 0, overdue: 0, bySubject: {} },
  );
}

export function generateSampleAssignments(count = 10_000): Assignment[] {
  const subjects = ['Toán học', 'Ngữ văn', 'Tiếng Anh', 'Vật lý', 'Hóa học'];
  const today = new Date();
  return Array.from({ length: count }, (_, index) => {
    const dueDate = new Date(today);
    dueDate.setDate(today.getDate() + (index % 31) - 10);
    return {
      id: `sample-${index + 1}`,
      title: `Bài tập mẫu ${index + 1}`,
      subject: subjects[index % subjects.length],
      dueDate: `${dueDate.getFullYear()}-${String(dueDate.getMonth() + 1).padStart(2, '0')}-${String(dueDate.getDate()).padStart(2, '0')}`,
      completed: index % 7 === 0,
    };
  });
}

export const initialAssignments: Assignment[] = [
  { id: 'assignment-1', title: 'Ôn tập phương trình bậc hai', subject: 'Toán học', dueDate: '2026-10-12', completed: false },
  { id: 'assignment-2', title: 'Viết cảm nhận về truyện ngắn', subject: 'Ngữ văn', dueDate: '2026-10-08', completed: false },
  { id: 'assignment-3', title: 'Bài tập thì hiện tại hoàn thành', subject: 'Tiếng Anh', dueDate: '2026-10-05', completed: true },
  { id: 'assignment-4', title: 'Định luật bảo toàn năng lượng', subject: 'Vật lý', dueDate: '2026-10-15', completed: false },
  { id: 'assignment-5', title: 'Cân bằng phương trình hóa học', subject: 'Hóa học', dueDate: '2026-10-10', completed: false },
];
