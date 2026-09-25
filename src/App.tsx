import { useState } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { SAMPLE_MOVIES } from "./data/sampleMovies";
import SearchBar from "./components/SearchBar";
import MovieList from "./components/MovieList";
import AboutPage from "./pages/AboutPage";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
  const [query, setQuery] = useState("");

  const filteredMovies = SAMPLE_MOVIES.filter((movie) =>
    movie.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <BrowserRouter>
      <div className="app-layout">
        <header className="site-header">
          <div className="header-inner">
            <div className="brand-logo">
              <span className="logo-dot"></span>
              <span className="logo-text">CineGrid</span>
            </div>

            <nav aria-label="Main navigation">
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
            </nav>

            <SearchBar query={query} onChange={setQuery} />
          </div>
        </header>

        <Routes>
          <Route
            path="/"
            element={
              <main className="main-container">
                <h1>Movie App</h1>
                <MovieList movies={filteredMovies} />
              </main>
            }
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
