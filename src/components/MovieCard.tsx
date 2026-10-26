import { Heart, Star } from 'lucide-react';
import type { Genre, Movie } from '../types';
import { getPosterUrl, getPlaceholderPoster } from '../data/sampleMovies';
import { getGenreNames } from '../data/genres';
import { useAppContext } from '../hooks/useAppContext';
type Props = {
    movie: Movie;
    genres?: Genre[];
    onSelect?: (movie: Movie) => void;
};
export default function MovieCard({ movie, genres, onSelect }: Props) {
    const { isFavorite, toggleFavorite } = useAppContext();
    const favorite = isFavorite(movie.id);
    const names = genres ? (movie.genre_ids ?? []).map(id => genres.find(g => g.id === id)?.name ?? 'Other') : getGenreNames(movie.genre_ids);
    return <article className="movie-card" tabIndex={0} aria-label={movie.title} onClick={() => onSelect?.(movie)} onKeyDown={e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onSelect?.(movie);
    } }}>
    <div className="poster-wrapper"><img className="poster-img" loading="lazy" src={getPosterUrl(movie.poster_path)} alt={movie.title} onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = getPlaceholderPoster(movie.title); }}/><div className="poster-overlay"><div className="card-top-badges"><span className="rating-badge"><Star size={14}/>{movie.vote_average?.toFixed(1) ?? 'N/A'}</span><button className={`favorite-btn ${favorite ? 'is-favorite' : ''}`} aria-label={favorite ? 'Remove from favourites' : 'Add to favourites'} aria-pressed={favorite} onClick={e => { e.stopPropagation(); toggleFavorite(movie); }}><Heart size={16} fill={favorite ? 'currentColor' : 'none'}/></button></div><span className="quick-view-hint">View Details</span></div></div>
    <div className="movie-card-info"><h2 className="movie-card-title">{movie.title}</h2><div className="movie-card-meta"><span>{movie.release_date?.slice(0, 4) || 'Unknown'}</span><span>{movie.vote_count?.toLocaleString() ?? '0'} votes</span></div><div className="movie-genres-tags">{names.map((name, i) => <span key={`${name}-${i}`} className="genre-tag">{name}</span>)}</div></div>
  </article>;
}
