import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AssignmentCard } from './AssignmentCard';
import type { Assignment } from './types';

const assignment: Assignment = {
  id: 'a1',
  title: 'Ôn tập đại số',
  subject: 'Toán',
  dueDate: '2026-10-15',
  completed: false,
};

function renderCard() {
  const onToggleCompleted = jest.fn();
  const onTogglePin = jest.fn();
  const onRemove = jest.fn();
  render(
    <AssignmentCard
      assignment={assignment}
      pinned={false}
      onToggleCompleted={onToggleCompleted}
      onTogglePin={onTogglePin}
      onRemove={onRemove}
    />,
  );
  return { onToggleCompleted, onTogglePin, onRemove };
}

describe('AssignmentCard', () => {
  it('shows the title, subject, and due date', () => {
    renderCard();
    expect(screen.getByRole('heading', { name: 'Ôn tập đại số' })).toBeInTheDocument();
    expect(screen.getByText('Toán')).toBeInTheDocument();
    expect(screen.getByText('Hạn nộp: 2026-10-15')).toBeInTheDocument();
  });

  it('calls the completion handler for its assignment', async () => {
    const user = userEvent.setup();
    const { onToggleCompleted } = renderCard();
    await user.click(screen.getByRole('button', { name: 'Hoàn thành' }));
    expect(onToggleCompleted).toHaveBeenCalledWith('a1');
  });

  it('toggles its pin and exposes the pinned state accessibly', async () => {
    const user = userEvent.setup();
    const { onTogglePin } = renderCard();
    const button = screen.getByRole('button', { name: 'Ghim bài tập' });
    await user.click(button);
    expect(onTogglePin).toHaveBeenCalledWith('a1');
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });
});
