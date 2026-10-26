import { useEffect, useReducer } from "react";
import type { ReactNode } from "react";
import type { Movie } from "../types";
import { AppContext } from "./appContextValue";
import type { AppState as State, AppAction as Action } from "./appContextValue";
import { storage } from "../utils/storage";
// Read saved preferences only when the provider first mounts.
function getInitialState(): State {
    return { favorites: storage.getFavorites(), theme: storage.getTheme() };
}
// Keep state updates pure; effects below handle persistence.
function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "TOGGLE_FAVOURITE": {
            const exists = state.favorites.some((movie) => movie.id === action.payload.id);
            return {
                ...state,
                favorites: exists
                    ? state.favorites.filter((movie) => movie.id !== action.payload.id)
                    : [...state.favorites, action.payload],
            };
        }
        case "SET_THEME":
            return { ...state, theme: action.payload };
    }
}
export function AppProvider({ children }: {
    children: ReactNode;
}) {
    const [state, dispatch] = useReducer(reducer, undefined, getInitialState);
    useEffect(() => {
        storage.setFavorites(state.favorites);
    }, [state.favorites]);
    useEffect(() => {
        storage.setTheme(state.theme);
    }, [state.theme]);
    function toggleFavorite(movie: Movie) {
        dispatch({ type: "TOGGLE_FAVOURITE", payload: movie });
    }
    function isFavorite(id: number) {
        return state.favorites.some((movie) => movie.id === id);
    }
    function toggleTheme() {
        dispatch({ type: "SET_THEME", payload: state.theme === "dark" ? "light" : "dark" });
    }
    return (<AppContext.Provider value={{ ...state, toggleFavorite, isFavorite, toggleTheme }}>
      {children}
    </AppContext.Provider>);
}
