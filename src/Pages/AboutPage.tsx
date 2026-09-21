import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <main>
      <h1>About CineGrid</h1>

      <p>
        CineGrid is a movie application built with React.
      </p>

      <Link to="/">
        Home
      </Link>
    </main>
  );
};

export default AboutPage;
