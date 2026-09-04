// ## Part 1 — Variables, Arrow Functions, Destructuring, Spread
// ### Exercise 6 — Spread and Rest

const watchlist = ["Inception", "Interstellar"];
const newMovies = ["Tenet", "Oppenheimer"];

// 1. Combine arrays without mutating either
const combined = [...watchlist, ...newMovies];

// 2. Add "Dune" at the beginning
const withDune = ["Dune", ...watchlist];

// 3. Shallow copy of watchlist
const copy = [...watchlist];

// 4. Merge two objects
const baseInfo = { title: "Dune", year: 2021 };
const extraInfo = { rating: 8.0, genre: "Sci-Fi" };

const merged = { ...baseInfo, ...extraInfo };

// 5. Copy baseInfo and set rating to 9.0
const updated = { ...baseInfo, rating: 9.0 };

// 6. Rest parameter
const logMovies = (...titles) => {
  titles.forEach(title => console.log(title));
};

logMovies("Inception", "Dune", "Tenet");

console.log(watchlist);
console.log(newMovies);
