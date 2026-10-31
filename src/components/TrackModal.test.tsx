import { render, screen, fireEvent } from '@testing-library/react';
import TrackModal from './TrackModal';
import { lastFmRequest } from '../utils/api';

jest.mock('../utils/api', () => ({ lastFmRequest: jest.fn() }));

test('renders fetched track information and removes executable HTML', async () => {
  (lastFmRequest as jest.Mock).mockResolvedValue({ track: {
    name: 'Example track', artist: { name: 'Example artist' },
    album: { title: 'Example album' },
    wiki: { summary: '<b>Track description</b><img src="x" onerror="alert(1)"><script>alert(1)</script>' },
  } });
  const close = jest.fn();
  const { container } = render(<TrackModal artist="Example artist" track="Example track" onClose={close} />);
  expect(await screen.findByText('Example track')).toBeInTheDocument();
  expect(screen.getByText('Track description')).toBeInTheDocument();
  expect(container.querySelector('script')).toBeNull();
  expect(container.querySelector('[onerror]')).toBeNull();
  fireEvent.click(screen.getByText('×'));
  expect(close).toHaveBeenCalledTimes(1);
});

test('shows an error when the external API fails', async () => {
  (lastFmRequest as jest.Mock).mockRejectedValue(new Error('offline'));
  render(<TrackModal artist="Example artist" track="Example track" onClose={() => {}} />);
  expect(await screen.findByText('Ошибка загрузки данных о треке')).toBeInTheDocument();
});
