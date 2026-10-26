import { SAMPLE_MOVIES } from '../data/sampleMovies';
import { GENRES } from '../data/genres';
import { storage } from '../utils/storage';
import type { Genre, Movie, MovieFilters, MovieResponse, MovieSort } from '../types';
const BASE_URL = 'https://api.themoviedb.org/3';
export function getCredential() { return storage.getApiKey() || import.meta.env.VITE_TMDB_API_KEY?.trim() || ''; }
async function request(path: string, params: Record<string, string>, signal?: AbortSignal) {
    const key = getCredential();
    const query = new URLSearchParams({ language: 'en-US', ...params });
    const headers: HeadersInit = { accept: 'application/json' };
    if (key.includes('.'))
        headers.Authorization = `Bearer ${key}`;
    else
        query.set('api_key', key);
    const response = await fetch(`${BASE_URL}${path}?${query}`, { headers, signal });
    if (!response.ok)
        throw new Error(`TMDB request failed (${response.status}). Check your API key or try again.`);
    return response.json();
}
export function sortMovies(movies: Movie[], sort: MovieSort = 'popularity') {
    return [...movies].sort((a, b) => sort === 'title' ? a.title.localeCompare(b.title) : sort === 'release_date' ? (b.release_date ?? '').localeCompare(a.release_date ?? '') : (b[sort] ?? 0) - (a[sort] ?? 0));
}
export function getLocalMovies({ search = '', genre = 0, sort, onlyFavorites, favorites }: MovieFilters = {}): MovieResponse {
    const source = onlyFavorites ? favorites ?? storage.getFavorites() : SAMPLE_MOVIES;
    const results = sortMovies(source.filter(m => m.title.toLowerCase().includes(search.trim().toLowerCase()) && (!genre || m.genre_ids?.includes(genre))), sort);
    return { results, total_pages: 1, total_results: results.length, isLiveApi: false };
}
export const movieService = {
    async fetchMovies(filters: MovieFilters = {}): Promise<MovieResponse> {
        if (!getCredential() || filters.onlyFavorites)
            return getLocalMovies(filters);
        const { search = '', genre = 0, page = 1, sort = 'popularity', signal } = filters;
        const path = search.trim() ? '/search/movie' : genre ? '/discover/movie' : '/movie/popular';
        const params: Record<string, string> = { page: String(page) };
        if (search.trim())
            params.query = search.trim();
        else if (genre) {
            params.with_genres = String(genre);
            params.sort_by = sort === 'title' ? 'original_title.asc' : sort === 'release_date' ? 'primary_release_date.desc' : `${sort}.desc`;
        }
        const data = await request(path, params, signal);
        if (!Array.isArray(data.results))
            throw new Error('TMDB returned an invalid movie response.');
        const results = sortMovies(data.results.filter((m: Movie) => !genre || m.genre_ids?.includes(genre)), sort);
        return { results, total_pages: Math.min(data.total_pages ?? 1, 500), total_results: data.total_results ?? results.length, isLiveApi: true };
    },
    async fetchGenres(signal?: AbortSignal): Promise<Genre[]> {
        if (!getCredential())
            return Object.entries(GENRES).map(([id, name]) => ({ id: Number(id), name }));
        const data = await request('/genre/movie/list', {}, signal);
        if (!Array.isArray(data.genres))
            throw new Error('TMDB returned an invalid genre response.');
        return data.genres;
    },
};
