import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import assignmentsReducer from '../features/assignments/assignmentsSlice';
import { isDevelopment } from './environment';

export const store = configureStore({
  reducer: {
    assignments: assignmentsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    isDevelopment
      ? getDefaultMiddleware().concat(createLogger())
      : getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
