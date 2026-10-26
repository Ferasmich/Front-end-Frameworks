import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { movieService, sortMovies } from '../services/movieService';
import { storage } from '../utils/storage';
import type { Movie } from '../types';
const movies: Movie[] = [{ id: 1, title: 'Alpha', genre_ids: [28], vote_average: 7 }, { id: 2, title: 'Beta', genre_ids: [35], vote_average: 9 }];
beforeEach(() => { localStorage.clear(); vi.stubEnv('VITE_TMDB_API_KEY', ''); });
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
function mockMovies() { const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ results: movies, total_pages: 2, total_results: 40 }) }); vi.stubGlobal('fetch', fetch); return fetch; }
describe('movie service', () => {
  it('uses local sample movies without credentials and makes no network call', async () => {
    const fetch = mockMovies();
    const result = await movieService.fetchMovies({ search: 'AVATAR', genre: 28 });
    expect(result.isLiveApi).toBe(false);
    expect(result.results.length).toBeGreaterThan(0);
    expect(result.results.every(movie => movie.title.toLowerCase().includes('avatar') && movie.genre_ids?.includes(28))).toBe(true);
    expect(fetch).not.toHaveBeenCalled();
  });
  it('uses runtime keys, discover parameters and cancellation signals', async () => {
    storage.setApiKey('  runtime-key  '); const fetch = mockMovies(); const controller = new AbortController();
    const result = await movieService.fetchMovies({ genre: 28, page: 2, sort: 'release_date', signal: controller.signal });
    const [url, options] = fetch.mock.calls[0];
    expect(new URL(url).pathname).toBe('/3/discover/movie');
    expect(new URL(url).searchParams.get('api_key')).toBe('runtime-key');
    expect(new URL(url).searchParams.get('with_genres')).toBe('28');
    expect(new URL(url).searchParams.get('page')).toBe('2');
    expect(new URL(url).searchParams.get('sort_by')).toBe('primary_release_date.desc');
    expect(options.signal).toBe(controller.signal);
    expect(result.results).toEqual([movies[0]]);
    expect(result.isLiveApi).toBe(true);
  });
  it('encodes search terms and supports environment Bearer tokens', async () => {
    vi.stubEnv('VITE_TMDB_API_KEY', 'a.b.c'); const fetch = mockMovies();
    await movieService.fetchMovies({ search: 'A & B' });
    const [url, options] = fetch.mock.calls[0];
    expect(new URL(url).pathname).toBe('/3/search/movie');
    expect(new URL(url).searchParams.get('query')).toBe('A & B');
    expect(new URL(url).searchParams.has('api_key')).toBe(false);
    expect(options.headers.Authorization).toBe('Bearer a.b.c');
  });
  it('filters favorites without making a live request', async () => {
    storage.setApiKey('key'); storage.setFavorites(movies); const fetch = mockMovies();
    const result = await movieService.fetchMovies({ onlyFavorites: true, search: 'beta' });
    expect(result.results).toEqual([movies[1]]); expect(fetch).not.toHaveBeenCalled();
  });
  it('surfaces HTTP failures instead of silently claiming live results', async () => {
    storage.setApiKey('key'); vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 401 }));
    await expect(movieService.fetchMovies()).rejects.toThrow('401');
  });
  it('fetches dynamic genre names', async () => {
    storage.setApiKey('key'); vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ genres: [{ id: 28, name: 'Updated Action' }] }) }));
    expect(await movieService.fetchGenres()).toEqual([{ id: 28, name: 'Updated Action' }]);
  });
  it('sorts a copy without mutating the original movies', () => {
    expect(sortMovies(movies, 'vote_average')).toEqual([movies[1], movies[0]]);
    expect(movies[0].title).toBe('Alpha');
  });
  it('handles corrupt favorites and preserves a valid theme independently', () => {
    localStorage.setItem('cinegrid_favorites', '{bad json'); storage.setTheme('light');
    expect(storage.getFavorites()).toEqual([]); expect(storage.getTheme()).toBe('light');
  });
});
