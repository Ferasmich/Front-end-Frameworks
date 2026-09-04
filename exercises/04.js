// ## Part 1 — Variables, Arrow Functions, Destructuring, Spread
// ### Exercise 4 — Destructuring Objects

const movie = {
  title: "Inception",
  year: 2010,
  rating: 8.8,
  genres: ["Action", "Sci-Fi", "Thriller"],
  director: {
    name: "Christopher Nolan",
    nationality: "British",
  },
};

// 1. Destructure title, year, and rating
const { title, year, rating } = movie;

// 2. Destructure director.name using nested destructuring
const { director: { name } } = movie;

// 3. Destructure title and rename it to movieTitle
const { title: movieTitle } = movie;

// 4. Destructure tagline with a default value
const { tagline = "No tagline available" } = movie;

// 5. Destructure in the parameter list
function printMovie({ title, year }) {
  console.log(title, year);
};

printMovie(movie); // "Inception" 2010
