import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AssignmentList } from './AssignmentList';
import assignmentsReducer from './assignmentsSlice';
import { getAssignments } from './api';
import type { Assignment } from './types';
import { usePinStore } from './usePinStore';

jest.mock('./api', () => ({ getAssignments: jest.fn() }));

const mockedGetAssignments = jest.mocked(getAssignments);
const sample: Assignment[] = [
  { id: 'a1', title: 'Bài kiểm tra', subject: 'Toán', dueDate: '2026-10-15', completed: false },
  { id: 'a2', title: 'Bài tập đọc', subject: 'Ngữ văn', dueDate: '2026-10-18', completed: false },
];

function renderList() {
  const store = configureStore({ reducer: { assignments: assignmentsReducer } });
  return render(
    <Provider store={store}>
      <AssignmentList />
    </Provider>,
  );
}

describe('AssignmentList async states', () => {
  beforeEach(() => {
    mockedGetAssignments.mockReset();
    mockedGetAssignments.mockImplementation(() => new Promise(() => undefined));
    usePinStore.setState({ pinnedIds: [] });
  });

  it('shows the loading status while the API request is pending', () => {
    mockedGetAssignments.mockReturnValue(new Promise(() => undefined));
    renderList();
    expect(screen.getByRole('status')).toHaveTextContent('Đang tải bài tập');
  });

  it('renders assignments after a successful API response', async () => {
    mockedGetAssignments.mockResolvedValue(sample);
    renderList();
    expect(await screen.findByText('Bài kiểm tra')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('shows the request error after an API failure', async () => {
    mockedGetAssignments.mockRejectedValue(new Error('Máy chủ ngoại tuyến'));
    renderList();
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Máy chủ ngoại tuyến'));
  });

  it('moves a pinned assignment to the top of the list', async () => {
    const user = userEvent.setup();
    mockedGetAssignments.mockResolvedValue(sample);
    renderList();
    await screen.findByText('Bài kiểm tra');
    const secondCard = screen.getByRole('heading', { name: 'Bài tập đọc' }).closest('article');
    if (!secondCard) throw new Error('Không tìm thấy thẻ bài tập.');
    await user.click(within(secondCard).getByRole('button', { name: 'Ghim bài tập' }));
    const titles = screen.getAllByRole('heading').map((heading) => heading.textContent);
    expect(titles.slice(0, 2)).toEqual(['Bài tập đọc', 'Bài kiểm tra']);
  });
});
