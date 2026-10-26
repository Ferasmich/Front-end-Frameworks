import { Link } from 'react-router-dom';
export default function AboutPage() {
    return <main className="main-container info-page"><h1>About CineGrid</h1>
    <p>A movie discovery app built with React, TypeScript and the TMDB API for the EPITA Front-End Frameworks course.</p>
    <p>Discover popular movies, search by title, filter genres, compare ratings and build a watchlist. Your watchlist and theme are saved in your browser.</p>
    <p>Sample movies are available without an API key. Connect your TMDB key from the home page to load live movies and genres.</p>
    <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
    <Link to="/">Back to Home</Link>
  </main>;
}
