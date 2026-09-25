import { createContext, useContext, useEffect, useReducer } from "react";
import type { ReactNode } from "react";
import type { Movie } from "../types";

type Theme = "dark" | "light";

interface State {
  favorites: Movie[];
  theme: Theme;
}

type Action =
  | { type: "TOGGLE_FAVOURITE"; payload: Movie }
  | { type: "SET_THEME"; payload: Theme };

interface AppContextValue extends State {
  toggleFavorite: (movie: Movie) => void;
  isFavorite: (id: number) => boolean;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

// Read saved preferences only when the provider first mounts.
function getInitialState(): State {
  let favorites: Movie[] = [];
  let theme: Theme = "dark";

  try {
    theme = localStorage.getItem("cinegrid_theme") === "light" ? "light" : "dark";
    const saved = JSON.parse(localStorage.getItem("cinegrid_favorites") ?? "[]");
    if (Array.isArray(saved)) {
      favorites = saved.filter(
        (movie): movie is Movie =>
          movie !== null &&
          typeof movie === "object" &&
          typeof movie.id === "number" &&
          typeof movie.title === "string"
      );
    }
  } catch {
    // Invalid or unavailable storage should not prevent the app from opening.
  }

  return { favorites, theme };
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

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState);

  useEffect(() => {
    try {
      localStorage.setItem("cinegrid_favorites", JSON.stringify(state.favorites));
    } catch {
      // Favorites still work in memory when storage is unavailable.
    }
  }, [state.favorites]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", state.theme);
    try {
      localStorage.setItem("cinegrid_theme", state.theme);
    } catch {
      // The theme still applies when storage is unavailable.
    }
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

  return (
    <AppContext.Provider value={{ ...state, toggleFavorite, isFavorite, toggleTheme }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used inside an AppProvider");
  }
  return context;
}
