import { useEffect, useState } from "react";
import "./App.css";
import { API_BASE_URL, API_KEY, API_OPTIONS } from "./config";
import Search from "./components/Search";

const App = function () {
  const [searchTerm, setSearchTerm] = useState("Search movies");
  const [errormessage, setErrorMessage] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async function () {
    try {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);
      
      if (!response.ok) throw new Error("network error");

      const data = await response.json();

      alert("response successful");
    } catch (error) {
      console.log("Failed to fetch: ", error);
      setErrorMessage("Error fetching message; please try again");
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

          {errormessage && <p className="text-red-500">{errormessage}</p>}
        </section>
      </div>
    </main>
  );
};

export default App;
