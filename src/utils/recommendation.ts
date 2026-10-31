import type { Movie } from '../types';

// The lowest genre ID wins ties, regardless of favourite order.
export function getPreferredGenre(favorites: Movie[]): number | undefined {
    const counts: Record<number, number> = {};
    for (const movie of favorites) {
        for (const id of new Set(movie.genre_ids ?? [])) {
            counts[id] = (counts[id] ?? 0) + 1;
        }
    }
    let preferred: number | undefined;
    for (const id of Object.keys(counts).map(Number).sort((a, b) => a - b)) {
        if (preferred === undefined || counts[id] > counts[preferred]) {
            preferred = id;
        }
    }
    return preferred;
}

export function pickRecommendation(candidates: Movie[], favorites: Movie[]): Movie | null {
    const unique = [...new Map(candidates.map(movie => [movie.id, movie])).values()];
    const unseen = unique.filter(movie => !favorites.some(favorite => favorite.id === movie.id));
    // Revisit a favourite only when there is no unseen candidate.
    const pool = unseen.length ? unseen : unique;
    return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
}
