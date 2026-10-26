import { useCallback, useState } from 'react';
import Header from '../components/Header';
import FilterBar from '../components/FilterBar';
import StatsBanner from '../components/StatsBanner';
import MovieList from '../components/MovieList';
import MovieModal from '../components/MovieModal';
import ApiConfigModal from '../components/ApiConfigModal';
import { useMovies } from '../hooks/useMovies';
import { useGenres } from '../hooks/useGenres';
import { useAppContext } from '../hooks/useAppContext';
import type { Movie, MovieSort } from '../types';
export default function HomePage() {
    const [search, setSearch] = useState('');
    const [genre, setGenre] = useState(0);
    const [sort, setSort] = useState<MovieSort>('popularity');
    const [onlyFavorites, setOnlyFavorites] = useState(false);
    const [compact, setCompact] = useState(false);
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState<Movie | null>(null);
    const [apiOpen, setApiOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const { favorites } = useAppContext();
    const { genres, error: genreError } = useGenres(refreshKey);
    const { movies, total_pages, total_results, isLiveApi, isLoading, error } = useMovies({ search, genre, sort, onlyFavorites, favorites, page }, refreshKey);
    const closeMovie = useCallback(() => setSelected(null), []);
    const closeApi = useCallback(() => setApiOpen(false), []);
    function surpriseMe() {
        if (isLoading || movies.length === 0) return;
        const randomIndex = Math.floor(Math.random() * movies.length);
        setSelected(movies[randomIndex]);
    }
    function reset() { setSearch(''); setGenre(0); setOnlyFavorites(false); setSort('popularity'); setPage(1); }
    return <><Header search={search} onSearch={value => { setSearch(value); setPage(1); }} onlyFavorites={onlyFavorites} onToggleFavorites={() => { setOnlyFavorites(v => !v); setPage(1); }} onOpenApiConfig={() => setApiOpen(true)}/>
    <main className="main-container"><div className="page-intro"><h1>{onlyFavorites ? 'Your Watchlist' : 'Discover Movies'}</h1><p>Find your next favourite film.</p>
      <button type="button" className="btn-icon-label surprise-button" onClick={surpriseMe} disabled={isLoading || movies.length === 0}>🎲 Surprise Me</button>
    </div>
      <StatsBanner movies={movies} total={total_results} genre={genres.find(g => g.id === genre)?.name ?? 'All Genres'} live={isLiveApi}/>
      <FilterBar genres={genres} genre={genre} onGenre={id => { setGenre(id); setPage(1); }} sort={sort} onSort={value => { setSort(value); setPage(1); }} compact={compact} onView={setCompact}/>
      {genreError && <p role="status">Genre names could not be refreshed. Using the offline genre list.</p>}
      {isLoading ? <p role="status">Loading movies...</p> : error ? <div className="empty-state" role="alert"><p>{error}</p><button className="btn-primary" onClick={() => setRefreshKey(v => v + 1)}>Try again</button></div> : movies.length ? <MovieList movies={movies} genres={genres} compact={compact} onSelect={setSelected}/> : <div className="empty-state"><p className="empty-title">No movies found.</p><p className="empty-text">Try another search or add movies to your watchlist.</p><button className="btn-primary" onClick={reset}>Reset Filters &amp; Show All</button></div>}
      {!isLoading && !error && total_pages > 1 && <nav className="pagination-container" aria-label="Movie pagination"><button className="page-btn" disabled={page <= 1} onClick={() => setPage(v => v - 1)}>Previous</button><span className="page-info">Page {page} of {total_pages}</span><button className="page-btn" disabled={page >= total_pages} onClick={() => setPage(v => v + 1)}>Next</button></nav>}
    </main>
    {selected && <MovieModal movie={selected} genres={genres} onClose={closeMovie}/>}
    {apiOpen && <ApiConfigModal onClose={closeApi} onSave={() => { closeApi(); setPage(1); setRefreshKey(v => v + 1); }}/>}
  </>;
}
