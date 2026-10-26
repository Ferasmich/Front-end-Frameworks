import type { Genre, Movie } from '../types';
import MovieCard from './MovieCard';
type MovieListProps = {
    movies: Movie[];
    genres?: Genre[];
    onSelect?: (movie: Movie) => void;
    compact?: boolean;
};
export default function MovieList({ movies, genres, onSelect, compact = false }: MovieListProps) {
    if (!movies.length)
        return <p>No movies found.</p>;
    return <div className={`movies-grid ${compact ? 'compact-view' : ''}`}>
    {movies.map(movie => <MovieCard key={movie.id} movie={movie} genres={genres} onSelect={onSelect}/>)}
  </div>;
}
