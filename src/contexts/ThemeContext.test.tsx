import { Profiler } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider, useTheme } from './ThemeContext';

function ThemeButton() {
  const { theme, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>Theme: {theme}</button>;
}

it('does not commit an unrelated subtree when the theme changes', () => {
  const onProfile = jest.fn();
  const onUnrelatedRender = jest.fn();
  function UnrelatedComponent() {
    onUnrelatedRender();
    return <p>Unrelated content</p>;
  }

  render(
    <ThemeProvider>
      <ThemeButton />
      <Profiler id="unrelated" onRender={onProfile}>
        <UnrelatedComponent />
      </Profiler>
    </ThemeProvider>,
  );
  expect(onUnrelatedRender).toHaveBeenCalledTimes(1);
  expect(onProfile).toHaveBeenCalledTimes(1);

  fireEvent.click(screen.getByRole('button', { name: 'Theme: light' }));

  expect(screen.getByRole('button', { name: 'Theme: dark' })).toBeInTheDocument();
  expect(onUnrelatedRender).toHaveBeenCalledTimes(1);
  expect(onProfile).toHaveBeenCalledTimes(1);
});
