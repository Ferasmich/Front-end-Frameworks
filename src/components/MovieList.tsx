import type { Movie } from "../types";
import MovieCard from "./MovieCard";

type MovieListProps = {
  movies: Movie[];
};


const MovieList = ({ movies }: MovieListProps) => {

  // If the array is empty
  if (movies.length === 0) {
    return <p>No movies found.</p>;
  }


  return (
    <div className="movies-grid">

      {movies.map((movie) => (

        <MovieCard
          key={movie.id}
          movie={movie}
        />

      ))}

    </div>
  );
};

export default MovieList;
