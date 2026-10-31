import { fetchTopArtists, lastFmRequest, searchTracks } from './api';

const originalKey = process.env.REACT_APP_LASTFM_API_KEY;
const originalFetch = global.fetch;

beforeEach(() => {
  process.env.REACT_APP_LASTFM_API_KEY = 'unit-test-public-key';
  global.fetch = jest.fn();
});
afterAll(() => {
  global.fetch = originalFetch;
  if (originalKey === undefined) delete process.env.REACT_APP_LASTFM_API_KEY;
  else process.env.REACT_APP_LASTFM_API_KEY = originalKey;
});

function response(body: unknown, status = 200) {
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: status >= 200 && status < 300, status, json: async () => body,
  });
}

test('missing configuration fails before a network request', async () => {
  delete process.env.REACT_APP_LASTFM_API_KEY;
  await expect(lastFmRequest('chart.getTopArtists')).rejects.toThrow('not configured');
  expect(global.fetch).not.toHaveBeenCalled();
});

test('HTTP failures are not mistaken for empty results', async () => {
  response({}, 429);
  await expect(fetchTopArtists()).rejects.toThrow('HTTP 429');
});

test('Last.fm errors in HTTP 200 responses are rejected', async () => {
  response({ error: 10, message: 'Invalid API key' });
  await expect(fetchTopArtists()).rejects.toThrow('API error 10');
});

test('search encodes special characters and normalizes artist names', async () => {
  response({ results: { trackmatches: { track: [{ name: 'Test track', artist: 'Test artist' }] } } });
  const tracks = await searchTracks('A&B / #1');
  const url = new URL((global.fetch as jest.Mock).mock.calls[0][0]);
  expect(url.searchParams.get('track')).toBe('A&B / #1');
  expect(url.searchParams.get('method')).toBe('track.search');
  expect(url.searchParams.get('api_key')).toBe('unit-test-public-key');
  expect(tracks[0].artist.name).toBe('Test artist');
});

test('an empty chart becomes an empty list', async () => {
  response({ artists: { artist: [] } });
  await expect(fetchTopArtists()).resolves.toEqual([]);
});
