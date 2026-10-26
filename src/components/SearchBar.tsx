import { Search, X } from 'lucide-react';
type SearchBarProps = {
    query: string;
    onChange: (newQuery: string) => void;
};
export default function SearchBar({ query, onChange }: SearchBarProps) {
    return <div className="search-input-wrapper"><Search className="search-icon" size={18} aria-hidden="true"/>
    <input type="text" className="search-input" aria-label="Search movies" placeholder="Search movies..." autoComplete="off" value={query} onChange={event => onChange(event.target.value)}/>
    {query && <button className="search-clear-btn" aria-label="Clear search" onClick={() => onChange('')}><X size={16}/></button>}
  </div>;
}
