import { getAssignments } from './api';

it('resolves the available assignment dataset', async () => {
  jest.useFakeTimers();
  const promise = getAssignments();
  await jest.advanceTimersByTimeAsync(180);
  await expect(promise).resolves.toHaveLength(5);
});
