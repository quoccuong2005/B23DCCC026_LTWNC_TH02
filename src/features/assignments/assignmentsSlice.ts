import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Assignment, AssignmentDraft } from './types';
import { getAssignments } from './api';
import { generateSampleAssignments, initialAssignments } from './utils';

export interface AssignmentsState {
  items: Assignment[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export const fetchAssignments = createAsyncThunk('assignments/fetch', getAssignments);

const initialState: AssignmentsState = {
  items: [],
  status: 'idle',
  error: null,
};

const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    addAssignment(state, action: PayloadAction<AssignmentDraft>) {
      state.items.unshift({
        ...action.payload,
        id: `assignment-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        completed: false,
      });
    },
    removeAssignment(state, action: PayloadAction<string>) {
      state.items = state.items.filter((assignment) => assignment.id !== action.payload);
    },
    toggleCompleted(state, action: PayloadAction<string>) {
      const assignment = state.items.find((item) => item.id === action.payload);
      if (assignment) assignment.completed = !assignment.completed;
    },
    loadStressTest(state) {
      state.items = generateSampleAssignments();
      state.status = 'succeeded';
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchAssignments.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Không thể tải danh sách bài tập.';
      });
  },
});

export const { addAssignment, removeAssignment, toggleCompleted, loadStressTest } =
  assignmentsSlice.actions;
export default assignmentsSlice.reducer;
export { initialAssignments };
