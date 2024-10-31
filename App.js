import { useEffect, useState } from 'react';
import './App.css';
import MovieCard from './MovieCard';

const API_URL = 'http://www.omdbapi.com/?apikey=4a20da7';

const App = () => { 
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('title'); // Dropdown option
  const [year, setYear] = useState(''); // Optional input for year search

  // Function to search movies based on searchBy value
  const searchMovies = async (query, defaultSearch = false) => {
    let searchURL = `${API_URL}`;

    if (defaultSearch) {
      // Perform a default search with a random/popular movie like "Spider-Man"
      searchURL += `&s=Spider-man`;
    } else {
      // Perform a user-initiated search
      if (searchBy === 'title') {
        searchURL += `&s=${query}`;
      } else if (searchBy === 'year') {
        if (!query) {
          alert('Please enter a movie title');
          return;
        }
        if (!year) {
          alert('Please enter a year');
          return;
        }
        searchURL += `&s=${query}&y=${year}`;
      } else if (searchBy === 'imdbID') {
        searchURL += `&i=${query}`;
      } else if (searchBy === 'type') {
        if (!query) {
          alert('Please enter a movie title');
          return;
        }
        searchURL += `&s=${query}&type=${query}`;
      }
    }

    const response = await fetch(searchURL);
    const data = await response.json();
    
    // Handle cases where no results are found
    if (data.Response === 'False') {
      setMovies([]);
    } else {
      setMovies(data.Search || []);
    }
  };

  // Load default random/popular movies on initial page load
  useEffect(() => {
    searchMovies('Spider-man', true); // Default search for Spider-man movies on page load
  }, []);

  return (
    <div className="App">
      <h1>Movies</h1>

      {/* Search bar */}
      <div className="search">
        <input
          placeholder="Enter movie to search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onDoubleClick={() => searchMovies(searchTerm)} // Trigger search on double-click
        />

        {/* Search icon (from public folder) */}
        <img 
          src="/search-icon.svg"
          alt="search"
          onClick={() => searchMovies(searchTerm)} // Trigger search on click
          style={{ cursor: 'pointer', marginLeft: '10px' }}
        />

        {/* Clear icon (from public folder) - Only show when searchTerm is not empty */}
        {searchTerm && (
          <img 
            src="/cross-icon.svg"
            alt="clear"
            onClick={() => setSearchTerm('')} // Clear the input when clicked
            style={{ cursor: 'pointer', marginLeft: '10px' }}
          />
        )}
      </div>

      {/* Conditional input for year when searching by year */}
      {searchBy === 'year' && (
        <div className="year-input">
          <input 
            type="text" 
            placeholder="Enter year" 
            value={year} 
            onChange={(e) => setYear(e.target.value)} 
          />
        </div>
      )}

      {/* Dropdown to choose search criteria */}
      <div className="dropdown">
        <select
          value={searchBy}
          onChange={(e) => setSearchBy(e.target.value)}
        >
          <option value="title">Search by Title</option>
          <option value="year">Search by Year</option>
          <option value="imdbID">Search by IMDb ID</option>
          <option value="type">Search by Type (movie, series, etc.)</option>
        </select>
      </div>

      {/* Display movie results */}
      {movies.length > 0 ? (
        <div className="container">
          {movies.map((movie) => (
            <MovieCard movie={movie} key={movie.imdbID} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>No movies found</h2>
        </div>
      )}
    </div>
  );
};

export default App;
