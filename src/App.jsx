import { useEffect, useState } from "react";
import "./App.css";
import { API_BASE_URL, API_KEY, API_OPTIONS } from "./config";
import Search from "./components/Search";
import Spinner from "./components/spinner";

const App = function () {
  const [searchTerm, setSearchTerm] = useState("Search movies");
  const [errorMessage, setErrorMessage] = useState(null);
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async function () {
    try {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        setErrorMessage("Error fetching message; please try again");
        throw new Error("network error");
      }

      const data = await response.json();

      if (!data.results) {
        setErrorMessage("No results found");
        setMovieList([]);
        throw new Error("No results");
      }
      setMovieList(data.results || []);

      // console.log(data.results);
    } catch (error) {
      console.log("Failed to fetch: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="hero background image" />
          <h1>
            Find <span className="text-gradient">Movies</span> you'll enjoy
            without hassles
          </h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="all-movies">
          <h2 className="">All movies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p>{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <p key={movie.id} className="text-white">{movie.title}</p>
              ))}
              <p>successful movies</p>
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
