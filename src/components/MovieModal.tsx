import type { Movie } from "../types";

import {
  getPosterUrl,
  getBackdropUrl,
} from "../data/sampleMovies";

import { getGenreNames } from "../data/genres";


type MovieModalProps = {
  // Movie currently opened
  movie: Movie | null;

  // Is movie favorite?
  isFavorite: boolean;

  // Close modal
  onClose: () => void;

  // Favorite function
  onFavorite: (movieId: number) => void;
};


const MovieModal = ({
  movie,
  isFavorite,
  onClose,
  onFavorite,
}: MovieModalProps) => {

  // If there is no selected movie,
  // don't display the modal.
  if (!movie) {
    return null;
  }


  const genres = getGenreNames(movie.genre_ids);

  const year = movie.release_date
    ? movie.release_date.substring(0, 4)
    : "Unknown";


  return (
    <div
      className="modal-overlay active"

      // Clicking the dark background closes modal
      onClick={onClose}
    >

      <div
        className="modal-dialog"

        // Prevent clicks inside modal from closing it
        onClick={(event) => event.stopPropagation()}
      >

        {/* Close button */}
        <button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close movie details"
        >
          ✕
        </button>


        {/* Large background image */}
        <div
          className="modal-backdrop-hero"
          style={{
            backgroundImage: `url(${getBackdropUrl(
              movie.backdrop_path,
            )})`,
          }}
        />


        <div className="modal-body">

          {/* Movie poster */}
          <img
            className="modal-poster"
            src={getPosterUrl(movie.poster_path)}
            alt={movie.title}
          />


          <div className="modal-content-details">

            {/* Movie title */}
            <h2 className="modal-title">
              {movie.title}
            </h2>


            {/* Show original title if different */}
            {movie.original_title !== movie.title && (
              <p className="modal-original-title">
                {movie.original_title}
              </p>
            )}


            {/* Basic movie information */}
            <div className="modal-meta-row">

              <span className="modal-meta-item">
                ⭐ {movie.vote_average?.toFixed(1) ?? "N/A"}
              </span>

              <span className="modal-meta-item">
                {year}
              </span>

              <span className="modal-meta-item">
                {movie.vote_count?.toLocaleString() ?? "0"} votes
              </span>

              <span className="modal-meta-item">
                {movie.original_language?.toUpperCase() ?? "N/A"}
              </span>

            </div>


            {/* Genres */}
            <div className="movie-genres-tags">

              {genres.map((genre) => (
                <span
                  className="genre-tag"
                  key={genre}
                >
                  {genre}
                </span>
              ))}

            </div>


            {/* Overview */}
            <div>

              <h3 className="modal-overview-heading">
                Overview
              </h3>

              <p className="modal-overview">
                {movie.overview}
              </p>

            </div>


            {/* Buttons */}
            <div className="modal-footer-actions">

              <button
                className="btn-primary"
                onClick={() => onFavorite(movie.id)}
              >
                {isFavorite
                  ? "♥ Remove from Watchlist"
                  : "♡ Add to Watchlist"}
              </button>


              <button
                className="btn-secondary"
                onClick={onClose}
              >
                Close
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default MovieModal;
