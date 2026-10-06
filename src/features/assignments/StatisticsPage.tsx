import { useMemo } from 'react';
import { useAppSelector } from '../../app/hooks';
import { calcStats } from './utils';

export default function StatisticsPage() {
  const assignments = useAppSelector((state) => state.assignments.items);
  const stats = useMemo(() => calcStats(assignments), [assignments]);

  return (
    <section className="statistics" aria-label="Thống kê bài tập">
      <h2>Thống kê</h2>
      <div className="stat-grid">
        <article className="stat-card"><span>Tổng bài</span><strong>{stats.total.toLocaleString('vi')}</strong></article>
        <article className="stat-card"><span>Đã hoàn thành</span><strong>{stats.completed.toLocaleString('vi')}</strong></article>
        <article className="stat-card"><span>Quá hạn</span><strong>{stats.overdue.toLocaleString('vi')}</strong></article>
      </div>
      <h3>Theo môn học</h3>
      <ul className="subject-stats">
        {Object.entries(stats.bySubject).map(([subject, count]) => (
          <li key={subject}><span>{subject}</span><strong>{count.toLocaleString('vi')}</strong></li>
        ))}
      </ul>
    </section>
  );
}
