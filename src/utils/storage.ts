import type { Movie } from '../types';
import type { Theme } from '../context/appContextValue';
function read(key: string) { try {
    return localStorage.getItem(key);
}
catch {
    return null;
} }
function write(key: string, value: string) { try {
    localStorage.setItem(key, value);
}
catch { /* Keep working in memory when storage is unavailable. */ } }
export function getFavorites(): Movie[] {
    try {
        const value: unknown = JSON.parse(read('cinegrid_favorites') ?? '[]');
        return Array.isArray(value) ? value.filter((m): m is Movie => m !== null && typeof m === 'object' && typeof m.id === 'number' && typeof m.title === 'string') : [];
    }
    catch {
        return [];
    }
}
export function setFavorites(movies: Movie[]) { write('cinegrid_favorites', JSON.stringify(movies)); }
export function toggleFavorite(movie: Movie) {
    const movies = getFavorites();
    const updated = movies.some(m => m.id === movie.id) ? movies.filter(m => m.id !== movie.id) : [...movies, movie];
    setFavorites(updated);
    return updated;
}
export function getTheme(): Theme { return read('cinegrid_theme') === 'light' ? 'light' : 'dark'; }
export function setTheme(theme: Theme) { document.documentElement.dataset.theme = theme; write('cinegrid_theme', theme); }
export function getApiKey() { return read('cinegrid_api_key') ?? ''; }
export function setApiKey(key: string) { write('cinegrid_api_key', key.trim()); }
export const storage = { getFavorites, setFavorites, toggleFavorite, getTheme, setTheme, getApiKey, setApiKey };
