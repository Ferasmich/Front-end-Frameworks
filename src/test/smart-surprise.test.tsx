import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import { AppProvider } from '../context/AppContext';
import { movieService } from '../services/movieService';
import { getPreferredGenre, pickRecommendation } from '../utils/recommendation';
import type { Movie } from '../types';

const alpha: Movie = { id: 101, title: 'Alpha', genre_ids: [878, 12] };
const beta: Movie = { id: 102, title: 'Beta', genre_ids: [878, 28] };
beforeEach(() => { localStorage.clear(); vi.stubEnv('VITE_TMDB_API_KEY', ''); });
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
function renderHome() {
    return render(<MemoryRouter><AppProvider><HomePage /></AppProvider></MemoryRouter>);
}

describe('recommendation rules', () => {
    it('has no preferred genre for zero favourites or missing genres', () => {
        expect(getPreferredGenre([])).toBeUndefined();
        expect(getPreferredGenre([{ id: 1, title: 'Unknown' }])).toBeUndefined();
    });
    it('uses the lowest genre ID for one favourite', () => {
        expect(getPreferredGenre([alpha])).toBe(12);
    });
    it('counts a dominant genre across several favourites', () => {
        expect(getPreferredGenre([alpha, beta])).toBe(878);
    });
    it('breaks ties independently of favourite order and ignores repeated genre IDs', () => {
        expect(getPreferredGenre([beta, alpha, { id: 3, title: 'Third', genre_ids: [12, 12] }])).toBe(12);
        expect(getPreferredGenre([alpha, beta, { id: 3, title: 'Third', genre_ids: [12] }])).toBe(12);
    });
    it('excludes favourites and removes duplicate candidate IDs', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.6);
        const third = { id: 103, title: 'Third' };
        expect(pickRecommendation([alpha, beta, beta, third], [alpha])).toEqual(third);
    });
    it('returns null for an empty pool and permits a favourite as a last resort', () => {
        expect(pickRecommendation([], [])).toBeNull();
        expect(pickRecommendation([alpha], [alpha])).toEqual(alpha);
    });
});

describe('recommendation pool requests', () => {
    it('fetches five discover pages without favourites and sends the preferred genre when supplied', async () => {
        localStorage.setItem('cinegrid_api_key', 'test-key');
        const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ results: [alpha], total_pages: 20 }) });
        vi.stubGlobal('fetch', fetchMock);
        expect(await movieService.fetchRecommendationPool()).toHaveLength(5);
        expect(fetchMock).toHaveBeenCalledTimes(5);
        for (let i = 0; i < 5; i++) {
            const url = new URL(fetchMock.mock.calls[i][0]);
            expect(url.pathname).toBe('/3/discover/movie');
            expect(url.searchParams.get('page')).toBe(String(i + 1));
            expect(url.searchParams.has('with_genres')).toBe(false);
        }
        await movieService.fetchRecommendationPool(878);
        expect(new URL(fetchMock.mock.calls[5][0]).searchParams.get('with_genres')).toBe('878');
    });
    it('stops at available pages and handles an empty response', async () => {
        localStorage.setItem('cinegrid_api_key', 'test-key');
        const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ results: [], total_pages: 0 }) });
        vi.stubGlobal('fetch', fetchMock);
        expect(await movieService.fetchRecommendationPool()).toEqual([]);
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });
    it('rejects failed and invalid API responses', async () => {
        localStorage.setItem('cinegrid_api_key', 'test-key');
        const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 503 });
        vi.stubGlobal('fetch', fetchMock);
        await expect(movieService.fetchRecommendationPool()).rejects.toThrow('503');
        fetchMock.mockResolvedValue({ ok: true, json: async () => ({}) });
        await expect(movieService.fetchRecommendationPool()).rejects.toThrow('invalid');
    });
    it('uses offline movies without making a request', async () => {
        const fetchMock = vi.fn(); vi.stubGlobal('fetch', fetchMock);
        expect((await movieService.fetchRecommendationPool(878)).every(movie => movie.genre_ids?.includes(878))).toBe(true);
        expect(fetchMock).not.toHaveBeenCalled();
    });
});

describe('Smart Surprise Me interface', () => {
    it('reads favourites, blocks repeated clicks, and opens the chosen MovieModal', async () => {
        localStorage.setItem('cinegrid_favorites', JSON.stringify([alpha]));
        let resolve!: (movies: Movie[]) => void;
        const request = vi.spyOn(movieService, 'fetchRecommendationPool').mockReturnValue(new Promise(done => { resolve = done; }));
        renderHome();
        const button = screen.getByRole('button', { name: /Smart Surprise Me/ });
        fireEvent.click(button); fireEvent.click(button);
        expect(button).toBeDisabled();
        expect(button).toHaveTextContent('Finding a movie...');
        expect(request).toHaveBeenCalledExactlyOnceWith(12);
        resolve([alpha, beta]);
        const dialog = await screen.findByRole('dialog');
        expect(within(dialog).getByRole('heading', { name: 'Beta' })).toBeInTheDocument();
        expect(button).toBeEnabled();
    });
    it('falls back to displayed movies after an API failure and reports it', async () => {
        vi.spyOn(movieService, 'fetchRecommendationPool').mockRejectedValue(new Error('network'));
        renderHome(); fireEvent.click(screen.getByRole('button', { name: /Smart Surprise Me/ }));
        expect(await screen.findByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText(/Could not reach TMDB. Showing/)).toBeInTheDocument();
    });
    it('falls back after empty matching results', async () => {
        vi.spyOn(movieService, 'fetchRecommendationPool').mockResolvedValue([]);
        renderHome(); fireEvent.click(screen.getByRole('button', { name: /Smart Surprise Me/ }));
        expect(await screen.findByRole('dialog')).toBeInTheDocument();
    });
    it.each([false, true])('keeps the modal closed with no available movies (failure: %s)', async failure => {
        const request = vi.spyOn(movieService, 'fetchRecommendationPool');
        if (failure) request.mockRejectedValue(new Error('network'));
        else request.mockResolvedValue([]);
        renderHome();
        fireEvent.change(screen.getByRole('textbox', { name: 'Search movies' }), { target: { value: 'no-such-movie-xyz' } });
        fireEvent.click(screen.getByRole('button', { name: /Smart Surprise Me/ }));
        await waitFor(() => expect(screen.getByText(failure ? /Could not reach TMDB and no movies/ : /No movies available/)).toBeInTheDocument());
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
});
