import { memo, Profiler, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FixedSizeList, type ListChildComponentProps } from 'react-window';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchAssignments,
  loadStressTest,
  removeAssignment,
  toggleCompleted,
} from './assignmentsSlice';
import { usePinStore } from './usePinStore';
import { useDebounce } from './useDebounce';
import type { Assignment } from './types';
import { AssignmentCard } from './AssignmentCard';
import { recordAssignmentCardRender, resetAssignmentCardRenderCount } from './performanceMetrics';
import { isDevelopment } from '../../app/environment';

interface RowData {
  assignments: Assignment[];
  pinnedIds: string[];
  onToggleCompleted: (id: string) => void;
  onTogglePin: (id: string) => void;
  onRemove: (id: string) => void;
}

const AssignmentRow = memo(({ index, style, data }: ListChildComponentProps<RowData>) => {
  const assignment = data.assignments[index];
  return (
    <div style={style} className="virtual-row">
      <Profiler id={`AssignmentCard-${assignment.id}`} onRender={recordAssignmentCardRender}>
        <AssignmentCard
          assignment={assignment}
          pinned={data.pinnedIds.includes(assignment.id)}
          onToggleCompleted={data.onToggleCompleted}
          onTogglePin={data.onTogglePin}
          onRemove={data.onRemove}
        />
      </Profiler>
    </div>
  );
});
AssignmentRow.displayName = 'AssignmentRow';

export function AssignmentList() {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.assignments);
  const pinnedIds = usePinStore((state) => state.pinnedIds);
  const togglePin = usePinStore((state) => state.togglePin);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const previousSearch = useRef('');
  const initializationStarted = useRef(false);

  useEffect(() => {
    if (status === 'idle' && !initializationStarted.current) {
      initializationStarted.current = true;
      if (new URLSearchParams(window.location.search).get('stress') === '1') {
        void dispatch(loadStressTest());
      } else {
        void dispatch(fetchAssignments());
      }
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (previousSearch.current !== debouncedSearch) {
      if (isDevelopment && debouncedSearch) {
        console.info(
          `[Profiler] AssignmentCard renders for "${debouncedSearch}":`,
          window.__assignmentCardRenderCount ?? 0,
        );
      }
      previousSearch.current = debouncedSearch;
    }
  }, [debouncedSearch]);

  const onToggleCompleted = useCallback(
    (id: string) => dispatch(toggleCompleted(id)),
    [dispatch],
  );
  const onRemove = useCallback((id: string) => dispatch(removeAssignment(id)), [dispatch]);
  const onTogglePin = useCallback((id: string) => togglePin(id), [togglePin]);

  const visibleAssignments = useMemo(() => {
    const normalizedSearch = debouncedSearch.trim().toLocaleLowerCase('vi');
    return [...items]
      .filter((assignment) =>
        `${assignment.title} ${assignment.subject}`.toLocaleLowerCase('vi').includes(normalizedSearch),
      )
      .sort((left, right) => {
        const leftPinned = pinnedIds.includes(left.id);
        const rightPinned = pinnedIds.includes(right.id);
        return Number(rightPinned) - Number(leftPinned);
      });
  }, [items, debouncedSearch, pinnedIds]);

  const rowData = useMemo(
    () => ({ assignments: visibleAssignments, pinnedIds, onToggleCompleted, onTogglePin, onRemove }),
    [visibleAssignments, pinnedIds, onToggleCompleted, onTogglePin, onRemove],
  );

  if (status === 'loading') return <p className="status-message" role="status">Đang tải bài tập…</p>;
  if (status === 'failed') {
    return <p className="status-message status-message--error" role="alert">{error}</p>;
  }

  return (
    <section className="assignment-list" aria-label="Danh sách bài tập">
      <div className="list-toolbar">
        <label className="search-field">
          <span>Tìm bài tập</span>
          <input
            type="search"
            aria-label="Tìm bài tập"
            value={search}
            onChange={(event) => {
              resetAssignmentCardRenderCount();
              setSearch(event.target.value);
            }}
            placeholder="Tên bài hoặc môn học"
          />
        </label>
        <button className="button button--secondary" onClick={() => dispatch(loadStressTest())}>
          Tạo 10.000 bài tập mẫu
        </button>
      </div>
      <p className="result-count" aria-live="polite">
        {visibleAssignments.length.toLocaleString('vi')} bài tập
      </p>
      {visibleAssignments.length === 0 ? (
        <p className="empty-state">Không tìm thấy bài tập phù hợp.</p>
      ) : (
        <FixedSizeList
          height={Math.min(520, visibleAssignments.length * 112)}
          width="100%"
          itemCount={visibleAssignments.length}
          itemSize={112}
          itemData={rowData}
          overscanCount={5}
        >
          {AssignmentRow}
        </FixedSizeList>
      )}
    </section>
  );
}
