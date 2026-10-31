const API_URL = 'https://ws.audioscrobbler.com/2.0/';

/** Shared transport for the public Last.fm read API. Never use an API secret here. */
export async function lastFmRequest(method: string, params: Record<string, string> = {}) {
  const apiKey = process.env.REACT_APP_LASTFM_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('Last.fm API key is not configured. See README configuration.');
  }
  const url = new URL(API_URL);
  Object.entries({ ...params, method, api_key: apiKey, format: 'json' })
    .forEach(([key, value]) => url.searchParams.set(key, value));
  const response = await fetch(url.toString());
  if (!response.ok) throw new Error(`Last.fm request failed (HTTP ${response.status}).`);
  const data = await response.json();
  // Last.fm can return API errors in a successful HTTP response.
  if (data.error) throw new Error(`Last.fm API error ${data.error}.`);
  return data;
}

/**
 * Получить топ-артистов.
 */
export async function fetchTopArtists() {
  const data = await lastFmRequest('chart.getTopArtists', { limit: '20' });
  return (data?.artists?.artist || []).map((a: any) => ({
    name: a.name,
    listeners: a.listeners,
    genres: a.tags?.tag?.map((t: any) => t.name) || [],
  }));
}

/**
 * Получить топ-треки.
 */
export async function fetchTopTracks() {
  const data = await lastFmRequest('chart.getTopTracks', { limit: '10' });
  return (data?.tracks?.track || []).map((t: any) => ({
    name: t.name,
    artist: { name: t.artist.name },
    listeners: t.listeners,
    tags: t.toptags,
  }));
}

/**
 * Поиск артистов по строке.
 */
export async function searchArtists(query: string) {
  const data = await lastFmRequest('artist.search', { artist: query, limit: '7' });
  return (data?.results?.artistmatches?.artist || []).map((a: any) => ({
    name: a.name,
    listeners: a.listeners,
    genres: [],
  }));
}

/**
 * Поиск треков по строке.
 */
export async function searchTracks(query: string) {
  const data = await lastFmRequest('track.search', { track: query, limit: '7' });
  return (data?.results?.trackmatches?.track || []).map((t: any) => ({
    name: t.name,
    artist: { name: t.artist },
    listeners: t.listeners,
    tags: [],
  }));
}
