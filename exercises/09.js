// ## Part 2 — Modules, Array Methods, async/await, Optional Chaining
// ### Exercise 9 — Optional Chaining and Nullish Coalescing

const movie1 = {
  title: "Inception",
  tagline: "Your mind is the scene of the crime.",
  director: { name: "Christopher Nolan" },
  cast: [{ name: "Leonardo DiCaprio" }, { name: "Elliot Page" }],
};

const movie2 = {
  title: "Unknown Film",
  tagline: "",
  // no director, no cast
};


// 1. Safely access movie2.director.name
const directorName = movie2.director?.name;

console.log(directorName);
// undefined


// 2. Display tagline, or "No tagline" if empty/missing
const tagline = movie2.tagline || "No tagline";

console.log(tagline);
// No tagline


// 3. Safely get the first cast member's name
const firstCastMember = movie2.cast?.[0]?.name;

console.log(firstCastMember);
// undefined


// 4. Display first cast member's name, or "Unknown cast"
const castName = movie2.cast?.[0]?.name ?? "Unknown cast";

console.log(castName);
// Unknown cast


// 5. Format TMDB poster URL
function formatPosterUrl(movie) {
  if (movie.poster_path) {
    return `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  }

  return "https://placehold.co/500x750?text=No+Image";
}


const tmdbMovie = {
  title: "Inception",
  poster_path: "/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg"
};

const tmdbMovieNoPoster = {
  title: "Obscure Film",
  poster_path: null
};

console.log(formatPosterUrl(tmdbMovie));         // https://image.tmdb.org/t/p/w500/oYuLEt3...
console.log(formatPosterUrl(tmdbMovieNoPoster)); // https://placehold.co/500x750?text=No+Image
