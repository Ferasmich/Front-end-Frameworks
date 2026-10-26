import { Link } from "react-router-dom";
const NotFoundPage = () => {
    return (<main className="main-container info-page">
      <h1>404</h1>

      <p>Page not found.</p>

      <Link to="/">
        Home
      </Link>
    </main>);
};
export default NotFoundPage;
