import { useEffect, useState } from 'react';
import { getCredential, getLocalMovies, movieService } from '../services/movieService';
import type { MovieFilters, MovieResponse } from '../types';
export function useMovies({ search = '', genre = 0, sort = 'popularity', onlyFavorites = false, favorites, page = 1 }: MovieFilters = {}, refreshKey = 0) {
    const local = !getCredential() || onlyFavorites;
    const [data, setData] = useState<MovieResponse>({ results: [], total_pages: 1, total_results: 0, isLiveApi: false });
    const [isLoading, setIsLoading] = useState(!local);
    const [error, setError] = useState('');
    useEffect(() => {
        const controller = new AbortController();
        setError('');
        if (local) {
            setIsLoading(false);
            return () => controller.abort();
        }
        setIsLoading(true);
        movieService.fetchMovies({ search, genre, sort, onlyFavorites, favorites, page, signal: controller.signal })
            .then(result => { if (!controller.signal.aborted)
            setData(result); })
            .catch(err => { if (!controller.signal.aborted)
            setError(err instanceof Error ? err.message : 'Unable to load movies.'); })
            .finally(() => { if (!controller.signal.aborted)
            setIsLoading(false); });
        return () => controller.abort();
    }, [search, genre, sort, onlyFavorites, favorites, page, refreshKey, local]);
    const result = local ? getLocalMovies({ search, genre, sort, onlyFavorites, favorites }) : data;
    return { ...result, movies: result.results, isLoading: local ? false : isLoading, error: local ? '' : error };
}
