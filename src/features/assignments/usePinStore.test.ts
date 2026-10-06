import { act, renderHook } from '@testing-library/react';
import { usePinStore } from './usePinStore';

describe('usePinStore', () => {
  beforeEach(() => usePinStore.setState({ pinnedIds: [] }));

  it('toggles pin membership without duplicate ids', () => {
    const { result } = renderHook(() => usePinStore());
    act(() => result.current.togglePin('important'));
    expect(result.current.isPinned('important')).toBe(true);
    act(() => result.current.togglePin('important'));
    expect(result.current.isPinned('important')).toBe(false);
    expect(result.current.pinnedIds).toEqual([]);
  });
});
