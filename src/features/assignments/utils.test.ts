import {
  calcDaysLeft,
  calcStats,
  generateSampleAssignments,
  isOverdue,
} from './utils';
import type { Assignment } from './types';

const today = new Date(2026, 9, 6, 12);

describe('assignment date and statistics helpers', () => {
  it('marks an unfinished assignment from a past date overdue', () => {
    expect(isOverdue('2026-10-05', false, today)).toBe(true);
  });

  it('does not mark a completed assignment overdue', () => {
    expect(isOverdue('2026-10-05', true, today)).toBe(false);
  });

  it('treats the current due date as not overdue', () => {
    expect(isOverdue('2026-10-06', false, today)).toBe(false);
  });

  it('calculates days remaining across dates', () => {
    expect(calcDaysLeft('2026-10-09', today)).toBe(3);
    expect(calcDaysLeft('2026-10-04', today)).toBe(-2);
  });

  it('counts completion, overdue items, and subjects', () => {
    const assignments: Assignment[] = [
      { id: 'a', title: 'One', subject: 'Math', dueDate: '2026-10-05', completed: false },
      { id: 'b', title: 'Two', subject: 'Math', dueDate: '2026-10-05', completed: true },
      { id: 'c', title: 'Three', subject: 'Science', dueDate: '2026-10-08', completed: false },
    ];
    expect(calcStats(assignments, today)).toEqual({
      total: 3,
      completed: 1,
      overdue: 1,
      bySubject: { Math: 2, Science: 1 },
    });
  });

  it('returns empty totals and the requested sample count for edge cases', () => {
    expect(calcStats([], today)).toEqual({ total: 0, completed: 0, overdue: 0, bySubject: {} });
    expect(generateSampleAssignments(0)).toEqual([]);
  });

  it('generates ten thousand deterministic sample records', () => {
    const generated = generateSampleAssignments();
    expect(generated).toHaveLength(10_000);
    expect(generated[0].id).toBe('sample-1');
    expect(new Set(generated.map(({ id }) => id)).size).toBe(10_000);
  });
});
