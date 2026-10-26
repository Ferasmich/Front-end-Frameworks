import type { Movie } from '../types';
export default function StatsBanner({ movies, total, genre, live }: {
    movies: Movie[];
    total: number;
    genre: string;
    live: boolean;
}) {
    const average = movies.length ? (movies.reduce((sum, m) => sum + (m.vote_average ?? 0), 0) / movies.length).toFixed(1) : '—';
    return <section className="stats-banner" aria-label="Movie statistics">{[[total.toLocaleString(), 'Results'], [average, 'Average rating on this page'], [genre, 'Active genre'], [live ? 'Live API' : 'Local data', 'Data source']].map(([value, label]) => <div className="stat-card" key={label}><div className="stat-info"><span className="stat-value">{value}</span><span className="stat-label">{label}</span></div></div>)}</section>;
}
