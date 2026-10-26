import { NavLink } from 'react-router-dom';
import { Heart, Moon, Settings, Sun } from 'lucide-react';
import { useAppContext } from '../hooks/useAppContext';
import SearchBar from './SearchBar';
type Props = {
    search: string;
    onSearch: (value: string) => void;
    onlyFavorites: boolean;
    onToggleFavorites: () => void;
    onOpenApiConfig: () => void;
};
export default function Header({ search, onSearch, onlyFavorites, onToggleFavorites, onOpenApiConfig }: Props) {
    const { theme, toggleTheme, favorites } = useAppContext();
    return <header className="site-header"><div className="header-inner">
    <NavLink to="/" className="brand-logo" aria-label="CineGrid"><span className="logo-dot"/><span className="logo-text">CineGrid</span></NavLink>
    <nav aria-label="Main navigation"><NavLink to="/" end>Home</NavLink><NavLink to="/about">About</NavLink></nav>
    <div className="header-search"><SearchBar query={search} onChange={onSearch}/></div>
    <div className="header-actions">
      <button className={`btn-icon-label ${onlyFavorites ? 'active' : ''}`} aria-pressed={onlyFavorites} onClick={onToggleFavorites}><Heart size={18}/> Watchlist <span className="count-badge">{favorites.length}</span></button>
      <button className="theme-toggle-btn" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} onClick={toggleTheme}>{theme === 'dark' ? <Sun size={20}/> : <Moon size={20}/>}</button>
      <button className="btn-icon-label" onClick={onOpenApiConfig}><Settings size={18}/> API Key</button>
    </div>
  </div></header>;
}
