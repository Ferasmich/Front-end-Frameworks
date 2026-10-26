import { useEffect, useState } from 'react';
import { GENRES } from '../data/genres';
import { getCredential, movieService } from '../services/movieService';
import type { Genre } from '../types';
const OFFLINE_GENRES: Genre[] = Object.entries(GENRES).map(([id, name]) => ({ id: Number(id), name }));
export function useGenres(refreshKey = 0) {
    const [genres, setGenres] = useState<Genre[]>(OFFLINE_GENRES);
    const [error, setError] = useState('');
    useEffect(() => {
        const controller = new AbortController();
        if (!getCredential()) {
            setGenres(OFFLINE_GENRES);
            setError('');
            return () => controller.abort();
        }
        setError('');
        movieService.fetchGenres(controller.signal).then(data => { if (!controller.signal.aborted)
            setGenres(data); }).catch(err => { if (!controller.signal.aborted)
            setError(err instanceof Error ? err.message : 'Unable to load genres.'); });
        return () => controller.abort();
    }, [refreshKey]);
    return { genres, error };
}
