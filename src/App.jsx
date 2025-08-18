import { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import "./App.css";
import { API_BASE_URL, API_KEY, API_OPTIONS } from "./config";
import Search from "./components/Search";
import Spinner from "./components/spinner";
import MovieCard from "./components/MovieCard";
import { getTrendingMovies, updateSearchCount } from "./appwrite";

const App = function () {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchDebounce, setSearchDebounce] = useState("");
  const [trendingMovies, setTrendingMovies] = useState([]);

  // Debounce waits for 500ms when ever the search term chances
  // Then takes the recent chances and update the variable
  useDebounce(() => setSearchDebounce(searchTerm), 500, [searchTerm]);

  const fetchMovies = async function (query = "") {
    setIsLoading(true);
    // the function for fetching api
    // uses a try, catch & finally
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        // if network error
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

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.log("Failed to fetch: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrends = async function () {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies.documents);
      console.log("movies: ", movies.documents);
      console.log("trendMovies: ", trendingMovies);
    } catch (error) {
      console.log("Error fetching trending movies.");
    }
  };

  useEffect(() => {
    fetchMovies(searchDebounce);
  }, [searchDebounce]);

  useEffect(() => {
    loadTrends();
  }, []);

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

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt="" />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2>All movies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p>{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
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
