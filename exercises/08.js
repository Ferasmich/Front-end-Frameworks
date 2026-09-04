// ## Part 2 — Modules, Array Methods, async/await, Optional Chaining
// ### Exercise 8 — async/await
// Run this file in the browser console or with Node 18+.

const BASE_URL = "https://jsonplaceholder.typicode.com";

// 1 & 2. Fetch the first 5 posts
async function fetchPosts() {
  try {
    const res = await fetch(BASE_URL + "/posts");

    const posts = await res.json();

    const firstFive = posts.slice(0, 5);

    firstFive.forEach(post => {
      console.log(post.title);
    });

    return firstFive;
  } catch (error) {
    console.log("Failed to load posts");
  }
}


// 3. Get a post by ID
async function getPostById(id) {
  const res = await fetch(BASE_URL + "/posts/" + id);

  if (!res.ok) {
    throw new Error("Post not found");
  }

  const post = await res.json();

  return post;
}


// Call getPostById(1)
getPostById(1)
  .then(post => console.log(post))
  .catch(error => console.log(error.message));


// Call getPostById(99999) and handle the error
getPostById(99999)
  .then(post => console.log(post))
  .catch(error => console.log("Error:", error.message));
