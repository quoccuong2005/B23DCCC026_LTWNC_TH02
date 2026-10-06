import { lazy, Suspense, useCallback, useState } from 'react';
import { useAppDispatch } from './app/hooks';
import { AssignmentForm } from './features/assignments/AssignmentForm';
import { AssignmentList } from './features/assignments/AssignmentList';
import { addAssignment } from './features/assignments/assignmentsSlice';
import type { AssignmentDraft } from './features/assignments/types';
import { useTheme } from './contexts/ThemeContext';

const StatisticsPage = lazy(() => import('./features/assignments/StatisticsPage'));

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button className="theme-toggle" onClick={toggleTheme} aria-label="Đổi chủ đề">
      {theme === 'light' ? '☾ Chế độ tối' : '☀ Chế độ sáng'}
    </button>
  );
}

export default function App() {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState<'assignments' | 'statistics'>('assignments');
  const handleAddAssignment = useCallback(
    (draft: AssignmentDraft) => dispatch(addAssignment(draft)),
    [dispatch],
  );

  return (
    <main className="page">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Quản lý bài tập - trang chủ">
          <span className="brand-mark">✓</span>
          <span>Học tập<span className="brand-accent">+</span></span>
        </a>
        <nav className="main-nav" aria-label="Điều hướng chính">
          <button
            className={page === 'assignments' ? 'nav-link is-active' : 'nav-link'}
            onClick={() => setPage('assignments')}
          >
            Bài tập
          </button>
          <button
            className={page === 'statistics' ? 'nav-link is-active' : 'nav-link'}
            onClick={() => setPage('statistics')}
          >
            Thống kê
          </button>
        </nav>
        <ThemeToggle />
      </header>

      {page === 'assignments' ? (
        <>
          <section className="hero">
            <div>
              <p className="eyebrow">KHÔNG GIAN HỌC TẬP CỦA BẠN</p>
              <h1>Chinh phục từng bài tập.</h1>
              <p className="hero-copy">Lên kế hoạch rõ ràng, theo dõi tiến độ và hoàn thành mục tiêu mỗi ngày.</p>
            </div>
            <div className="hero-illustration" aria-hidden="true">
              <span>✦</span><span>✓</span><span>✎</span>
            </div>
          </section>
          <AssignmentForm onSubmit={handleAddAssignment} />
          <AssignmentList />
        </>
      ) : (
        <Suspense fallback={<p role="status" className="status-message">Đang tải thống kê…</p>}>
          <StatisticsPage />
        </Suspense>
      )}
      <footer>Học tập từng bước nhỏ, tiến bộ mỗi ngày.</footer>
    </main>
  );
}
