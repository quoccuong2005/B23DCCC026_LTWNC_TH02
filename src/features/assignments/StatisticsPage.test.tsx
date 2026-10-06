import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import assignmentsReducer from './assignmentsSlice';
import StatisticsPage from './StatisticsPage';

it('shows summary and per-subject counts', () => {
  const store = configureStore({
    reducer: { assignments: assignmentsReducer },
    preloadedState: {
      assignments: {
        status: 'succeeded' as const,
        error: null,
        items: [
          { id: 'a', title: 'A', subject: 'Toán', dueDate: '2099-01-01', completed: true },
          { id: 'b', title: 'B', subject: 'Toán', dueDate: '2099-01-01', completed: false },
        ],
      },
    },
  });
  render(<Provider store={store}><StatisticsPage /></Provider>);
  expect(screen.getAllByText('2')).toHaveLength(2);
  expect(screen.getByText('Toán')).toBeInTheDocument();
});
