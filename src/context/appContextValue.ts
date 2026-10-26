import { createContext } from 'react';
import type { Movie } from '../types';
export type Theme = 'dark' | 'light';
export interface AppState {
    favorites: Movie[];
    theme: Theme;
}
export type AppAction = {
    type: 'TOGGLE_FAVOURITE';
    payload: Movie;
} | {
    type: 'SET_THEME';
    payload: Theme;
};
export interface AppContextValue extends AppState {
    toggleFavorite: (movie: Movie) => void;
    isFavorite: (id: number) => boolean;
    toggleTheme: () => void;
}
export const AppContext = createContext<AppContextValue | undefined>(undefined);
