import { memo } from 'react';
import { calcDaysLeft, isOverdue } from './utils';
import type { Assignment } from './types';

interface AssignmentCardProps {
  assignment: Assignment;
  pinned: boolean;
  onToggleCompleted: (id: string) => void;
  onTogglePin: (id: string) => void;
  onRemove: (id: string) => void;
}

function AssignmentCardComponent({
  assignment,
  pinned,
  onToggleCompleted,
  onTogglePin,
  onRemove,
}: AssignmentCardProps) {
  const overdue = isOverdue(assignment.dueDate, assignment.completed);
  const daysLeft = calcDaysLeft(assignment.dueDate);

  return (
    <article className={`assignment-card${assignment.completed ? ' is-complete' : ''}`}>
      <div className="assignment-card__content">
        <div className="assignment-card__meta">
          <span className="subject-tag">{assignment.subject}</span>
          <span className={overdue ? 'due-date is-overdue' : 'due-date'}>
            {assignment.completed
              ? 'Đã hoàn thành'
              : overdue
                ? 'Quá hạn'
                : daysLeft === 0
                  ? 'Hạn hôm nay'
                  : `Còn ${daysLeft} ngày`}
          </span>
        </div>
        <h3>{assignment.title}</h3>
        <time dateTime={assignment.dueDate}>Hạn nộp: {assignment.dueDate}</time>
      </div>
      <div className="assignment-card__actions">
        <button
          type="button"
          className={pinned ? 'icon-button is-pinned' : 'icon-button'}
          aria-label={pinned ? 'Bỏ ghim bài tập' : 'Ghim bài tập'}
          aria-pressed={pinned}
          onClick={() => onTogglePin(assignment.id)}
        >
          {pinned ? '★' : '☆'}
        </button>
        <button
          type="button"
          className="button button--small"
          onClick={() => onToggleCompleted(assignment.id)}
        >
          {assignment.completed ? 'Đánh dấu chưa xong' : 'Hoàn thành'}
        </button>
        <button
          type="button"
          className="icon-button icon-button--danger"
          aria-label={`Xóa ${assignment.title}`}
          onClick={() => onRemove(assignment.id)}
        >
          ×
        </button>
      </div>
    </article>
  );
}

export const AssignmentCard = memo(AssignmentCardComponent);
