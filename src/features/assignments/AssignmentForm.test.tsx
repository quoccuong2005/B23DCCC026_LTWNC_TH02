import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AssignmentForm } from './AssignmentForm';

describe('AssignmentForm', () => {
  it('validates required fields before submitting', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(<AssignmentForm onSubmit={onSubmit} />);
    await user.click(screen.getByRole('button', { name: 'Thêm bài tập' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Vui lòng nhập đầy đủ');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('trims and submits valid fields, then clears the form', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(<AssignmentForm onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText('Tên bài tập'), '  Ôn tập  ');
    await user.type(screen.getByLabelText('Môn học'), ' Toán ');
    await user.type(screen.getByLabelText('Hạn nộp'), '2026-10-12');
    await user.click(screen.getByRole('button', { name: 'Thêm bài tập' }));
    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Ôn tập',
      subject: 'Toán',
      dueDate: '2026-10-12',
    });
    expect(screen.getByLabelText('Tên bài tập')).toHaveValue('');
  });
});
