export interface Movie {
    id: number;
    title: string;
    original_title?: string;
    overview?: string;
    poster_path?: string | null;
    backdrop_path?: string | null;
    genre_ids?: number[];
    release_date?: string;
    vote_average?: number;
    vote_count?: number;
    popularity?: number;
    adult?: boolean;
    original_language?: string;
    video?: boolean;
}
export interface Genre {
    id: number;
    name: string;
}
export type MovieSort = 'popularity' | 'vote_average' | 'release_date' | 'title';
export interface MovieFilters {
    search?: string;
    genre?: number;
    sort?: MovieSort;
    onlyFavorites?: boolean;
    favorites?: Movie[];
    page?: number;
    signal?: AbortSignal;
}
export interface MovieResponse {
    results: Movie[];
    total_pages: number;
    total_results: number;
    isLiveApi: boolean;
}
