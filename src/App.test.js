import { render, screen } from '@testing-library/react';
import App from './App';

test('renders CustomizeTable component', () => {
  render(<App />);
  const customizeTableElement = screen.getByTestId('customize-table');
  expect(customizeTableElement).toBeInTheDocument();
});

