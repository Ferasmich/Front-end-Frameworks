import { render, screen, fireEvent, within, waitFor, renderHook } from '@testing-library/react';
import { beforeEach, afterEach, expect, it, vi } from 'vitest';
import App from '../App';
import { useMovies } from '../hooks/useMovies';
import { useAppContext } from '../hooks/useAppContext';
beforeEach(() => { localStorage.clear(); window.history.replaceState({}, '', '/'); vi.stubEnv('VITE_TMDB_API_KEY', ''); });
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });
it('synchronizes modal, card, header and persisted watchlist, and restores scroll and focus', () => {
  render(<App />);
  const card = screen.getByRole('article', { name: 'Avatar: The Way of Water' });
  card.focus(); fireEvent.keyDown(card, { key: 'Enter' });
  const dialog = screen.getByRole('dialog', { name: 'Avatar: The Way of Water' });
  expect(document.body.style.overflow).toBe('hidden');
  fireEvent.click(within(dialog).getByRole('button', { name: 'Add to Watchlist' }));
  expect(within(card).getByRole('button', { name: 'Remove from favourites' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Watchlist 1/ })).toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem('cinegrid_favorites')!)[0].title).toBe('Avatar: The Way of Water');
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(document.body.style.overflow).toBe(''); expect(document.activeElement).toBe(card);
  fireEvent.click(screen.getByRole('button', { name: /Watchlist 1/ }));
  expect(screen.getAllByRole('article')).toHaveLength(1);
  fireEvent.click(within(card).getByRole('button', { name: 'Remove from favourites' }));
  expect(screen.getByText('No movies found.')).toBeInTheDocument();
});
it('keeps the dialog open for content clicks and closes on the backdrop', () => {
  render(<App />); fireEvent.click(screen.getAllByRole('article')[0]);
  const dialog = screen.getByRole('dialog'); fireEvent.click(within(dialog).getByText('Overview'));
  expect(dialog).toBeInTheDocument(); fireEvent.click(dialog.parentElement!);
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
it('applies genre, sort and view controls to the local movie list', () => {
  render(<App />); fireEvent.click(screen.getByRole('button', { name: 'Animation' }));
  expect(screen.queryByRole('article', { name: 'John Wick: Chapter 4' })).not.toBeInTheDocument();
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'title' } });
  const titles = screen.getAllByRole('heading', { level: 2 }).map(node => node.textContent!);
  expect(titles).toEqual([...titles].sort((a, b) => a.localeCompare(b)));
  fireEvent.click(screen.getByRole('button', { name: 'List view' }));
  expect(screen.getAllByRole('article')[0].parentElement).toHaveClass('compact-view');
});
it('saves API configuration and refetches live movies and genres', async () => {
  const fetch = vi.fn().mockImplementation(async (url: string) => ({ ok: true, json: async () => url.includes('/genre/') ? { genres: [{ id: 28, name: 'Live Action' }] } : { results: [{ id: 99, title: 'Live Movie', genre_ids: [28] }], total_pages: 1, total_results: 1 } }));
  vi.stubGlobal('fetch', fetch); render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'API Key' }));
  fireEvent.change(screen.getByLabelText('API key or token'), { target: { value: ' runtime-key ' } });
  fireEvent.click(screen.getByRole('button', { name: 'Save configuration' }));
  await screen.findByRole('article', { name: 'Live Movie' });
  expect(localStorage.getItem('cinegrid_api_key')).toBe('runtime-key');
  expect(screen.getByRole('button', { name: 'Live Action' })).toBeInTheDocument();
  expect(screen.getByText('Live API')).toBeInTheDocument();
});
it('aborts pending requests on unmount', () => {
  localStorage.setItem('cinegrid_api_key', 'key');
  const fetch = vi.fn().mockImplementation(() => new Promise(() => {})); vi.stubGlobal('fetch', fetch);
  const { unmount } = renderHook(() => useMovies());
  const signal = fetch.mock.calls[0][1].signal as AbortSignal;
  expect(signal.aborted).toBe(false); unmount(); expect(signal.aborted).toBe(true);
});
it('clears loading and exposes live HTTP errors', async () => {
  localStorage.setItem('cinegrid_api_key', 'key');
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 401 }));
  const { result } = renderHook(() => useMovies());
  await waitFor(() => expect(result.current.isLoading).toBe(false));
  expect(result.current.error).toContain('401'); expect(result.current.movies).toEqual([]);
});
it('guards context access outside its provider', () => {
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
  try { expect(() => renderHook(() => useAppContext())).toThrow('useAppContext must be used inside an AppProvider'); }
  finally { consoleError.mockRestore(); }
});
