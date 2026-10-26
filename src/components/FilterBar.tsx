import { Grid2X2, List } from 'lucide-react';
import type { Genre, MovieSort } from '../types';
type Props = {
    genres: Genre[];
    genre: number;
    onGenre: (id: number) => void;
    sort: MovieSort;
    onSort: (sort: MovieSort) => void;
    compact: boolean;
    onView: (compact: boolean) => void;
};
export default function FilterBar({ genres, genre, onGenre, sort, onSort, compact, onView }: Props) {
    return <section className="filter-bar" aria-label="Movie filters">
    <div className="genre-pills-scroll">{[{ id: 0, name: 'All Genres' }, ...genres].map(g => <button key={g.id} className={`genre-pill ${genre === g.id ? 'active' : ''}`} aria-pressed={genre === g.id} onClick={() => onGenre(g.id)}>{g.name}</button>)}</div>
    <div className="filter-actions-right"><select className="sort-select" aria-label="Sort movies" value={sort} onChange={e => onSort(e.target.value as MovieSort)}><option value="popularity">Popularity</option><option value="vote_average">Rating</option><option value="release_date">Release date</option><option value="title">Title</option></select>
      <div className="view-toggle-group"><button className={`view-btn ${!compact ? 'active' : ''}`} aria-label="Grid view" aria-pressed={!compact} onClick={() => onView(false)}><Grid2X2 size={18}/></button><button className={`view-btn ${compact ? 'active' : ''}`} aria-label="List view" aria-pressed={compact} onClick={() => onView(true)}><List size={18}/></button></div>
    </div>
  </section>;
}
