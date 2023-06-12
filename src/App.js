import React, { useState, useEffect } from 'react';
// const response = await fetch(`https://omdbapi.com/?t=${encodeURIComponent(film.title)}&apikey=ac6e421`);

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { fetchFilms, selectFilms, selectLoading, selectError } from './features/counterSlice';

// Components
import FilmTable from './components/FilmTable';
import FilmDetails from './components/FilmDetails';

function App() {
  // STATE
  const [input, setInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [filmDetails, setFilmDetails] = useState(null);
  const [rowClick, setRowClicked] = useState(false);

  // UseSelector
  const films = useSelector(selectFilms);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const dispatch = useDispatch();

  // Functions
  const handleSearch = (e) => {
    setInput(e.target.value);
  };

  const handleSort = () => {
    setSortAsc(!sortAsc);
    setSearchResults((prevResults) =>
      [...prevResults].sort((a, b) =>
        sortAsc ? a.release_date.localeCompare(b.release_date) : b.release_date.localeCompare(a.release_date)
      )
    );
  };

  const handleRowClick = async (film) => {
    try {
      const response = await fetch(`https://omdbapi.com/?t=${encodeURIComponent(film.title)}&apikey=ac6e421`);
      const data = await response.json();
      setFilmDetails(data);
      setSelectedFilm(film);
      setRowClicked(true);
    } catch (error) {
      console.error('Failed to fetch film details:', error);
    }
  };

  const convertRatingToNumber = (rating) => {
    const numericRating = rating.Value.split('/')[0];
    const convertedRating = numericRating.includes('.') ? parseFloat(numericRating) : parseFloat(numericRating) / 10;
    return convertedRating;
  };

  const sumOfRatings = filmDetails?.Ratings.reduce((total, rating) => total + convertRatingToNumber(rating), 0);
  const averageRating = Math.round(sumOfRatings / filmDetails?.Ratings.length);

  useEffect(() => {
    dispatch(fetchFilms());
  }, [dispatch]);

  useEffect(() => {
    const results = films.filter((film) => film.title.toLowerCase().includes(input.toLowerCase()) || film.release_date.includes(input));
    setSearchResults(results);
  }, [films, input]);

  return (
    <>
      <div className="bg-secondary p-2">
        <div>
          <button onClick={handleSort} className="rounded btn btn-light fw-bold border-primary text-primary ">
            Sort by
          </button>

          <input
            type="text"
            className="rounded border border-gray-700 py-1 px-5 w-75 mx-3"
            placeholder="Search by title or release date..."
            value={input}
            onChange={handleSearch}
          />
          <i class="fa fa-search" aria-hidden="true" style={{ marginLeft: '-67rem' }}></i>
        </div>
      </div>

      <div className="bg-zinc-900 text-zinc-100 flex justify-center items-center flex-col min-h-screen gap-6">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error: {error}</div>
        ) : (
          <div className="d-flex border border-light">
            <FilmTable searchResults={searchResults} handleRowClick={handleRowClick} />
            {rowClick ? (
              <FilmDetails filmDetails={filmDetails} averageRating={averageRating} />
            ) : (
              
              <div>
                <p className="fw-bold">Enjoy watching MOVIES here!</p>
                <p className="ls-base">
                    By Clicking on movies from the list you will find the description where it shows the release date and rating of the movie.
                  <br/>
                    If you wish to watch a movie, you simply open movies from the list and enjoy an uninterrupted HQ movie-watching experience anytime and anywhere you like. 
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
