import reducer, {
  addAssignment,
  fetchAssignments,
  loadStressTest,
  removeAssignment,
  toggleCompleted,
  type AssignmentsState,
} from './assignmentsSlice';

const initialState: AssignmentsState = { items: [], status: 'idle', error: null };
const draft = { title: 'Bài mới', subject: 'Toán', dueDate: '2026-10-12' };

describe('assignmentsSlice', () => {
  it('adds an incomplete assignment with a generated id', () => {
    const state = reducer(initialState, addAssignment(draft));
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toMatchObject({ ...draft, completed: false });
    expect(state.items[0].id).toContain('assignment-');
  });

  it('removes an assignment by id', () => {
    const state = reducer(
      { ...initialState, items: [{ id: 'one', ...draft, completed: false }] },
      removeAssignment('one'),
    );
    expect(state.items).toEqual([]);
  });

  it('does not fail when asked to remove an unknown assignment', () => {
    expect(reducer(initialState, removeAssignment('missing'))).toEqual(initialState);
  });

  it('toggles completion only when the requested assignment exists', () => {
    const withAssignment = { ...initialState, items: [{ id: 'one', ...draft, completed: false }] };
    expect(reducer(withAssignment, toggleCompleted('one')).items[0].completed).toBe(true);
    expect(reducer(withAssignment, toggleCompleted('missing'))).toEqual(withAssignment);
  });

  it('tracks async request success and failure states', () => {
    const pending = reducer(initialState, fetchAssignments.pending('request-1'));
    expect(pending.status).toBe('loading');
    const failed = reducer(pending, fetchAssignments.rejected(new Error('offline'), 'request-1'));
    expect(failed).toMatchObject({ status: 'failed', error: 'offline' });
    const success = reducer(failed, fetchAssignments.fulfilled([], 'request-2'));
    expect(success).toMatchObject({ status: 'succeeded', items: [], error: null });
  });

  it('loads a ten-thousand-item stress dataset', () => {
    const state = reducer(initialState, loadStressTest());
    expect(state.status).toBe('succeeded');
    expect(state.items).toHaveLength(10_000);
  });
});
