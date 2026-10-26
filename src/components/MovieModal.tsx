import { Heart, X, Youtube } from 'lucide-react';
import type { Genre, Movie } from '../types';
import { getBackdropUrl, getPosterUrl } from '../data/sampleMovies';
import { useAppContext } from '../hooks/useAppContext';
import { useModal } from '../hooks/useModal';
export default function MovieModal({ movie, genres, onClose }: {
    movie: Movie;
    genres: Genre[];
    onClose: () => void;
}) {
    const { isFavorite, toggleFavorite } = useAppContext();
    const ref = useModal(onClose);
    return <div className="modal-overlay active" onClick={e => { if (e.target === e.currentTarget)
        onClose(); }}><div className="modal-dialog" ref={ref} role="dialog" aria-modal="true" aria-labelledby="movie-title" tabIndex={-1}>
    <button className="modal-close-btn" onClick={onClose} aria-label="Close movie details"><X /></button><div className="modal-backdrop-hero" style={{ backgroundImage: `url(${getBackdropUrl(movie.backdrop_path)})` }}/>
    <div className="modal-body"><img className="modal-poster" src={getPosterUrl(movie.poster_path)} alt={movie.title}/><div className="modal-content-details"><h2 className="modal-title" id="movie-title">{movie.title}</h2>{movie.original_title && movie.original_title !== movie.title && <p className="modal-original-title">{movie.original_title}</p>}<div className="modal-meta-row"><span>★ {movie.vote_average?.toFixed(1) ?? 'N/A'}</span><span>{movie.release_date || 'Release date unknown'}</span><span>{movie.vote_count?.toLocaleString() ?? '0'} votes</span><span>{movie.original_language?.toUpperCase()}</span></div><div className="movie-genres-tags">{(movie.genre_ids ?? []).map(id => <span className="genre-tag" key={id}>{genres.find(g => g.id === id)?.name ?? 'Other'}</span>)}</div><h3 className="modal-overview-heading">Overview</h3><p className="modal-overview">{movie.overview || 'No overview available.'}</p><div className="modal-footer-actions"><button className="btn-primary" onClick={() => toggleFavorite(movie)}><Heart size={16}/>{isFavorite(movie.id) ? 'Remove from Watchlist' : 'Add to Watchlist'}</button><a className="btn-secondary" href={`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + ' official trailer')}`} target="_blank" rel="noreferrer"><Youtube size={16}/> Trailer</a></div></div></div>
  </div></div>;
}
