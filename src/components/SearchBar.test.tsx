import { fireEvent, render, screen } from '@testing-library/react';
import SearchBar from './SearchBar';

test('submits a trimmed search term', () => {
  const onSearch = jest.fn();
  render(<SearchBar onSearch={onSearch} />);
  fireEvent.change(screen.getByRole('textbox'), { target: { value: '  Radiohead  ' } });
  fireEvent.click(screen.getByRole('button', { name: 'Поиск' }));
  expect(onSearch).toHaveBeenCalledWith('Radiohead');
});

test('does not submit a blank search', () => {
  const onSearch = jest.fn();
  render(<SearchBar onSearch={onSearch} />);
  fireEvent.click(screen.getByRole('button', { name: 'Поиск' }));
  expect(onSearch).not.toHaveBeenCalled();
});
