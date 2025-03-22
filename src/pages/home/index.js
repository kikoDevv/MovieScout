import { lazyloadMovies } from "./scrollTiming.js";
import { fetchData } from "./fetchMovies.js";
import { searchBarSticky } from "./scrollTiming.js";
import { filterMenu } from "./filterMenu.js";
import { setupMovieModal } from "../moviesDetails/movieModal.js";

// Remove pagination import since it will be called by fetchData
// import { createPaginationDots } from "./scrollIndicator.js";

//------------creates movie card and fetchs data from IMDB api-----------------
fetchData();
//-------lazy load movieCard animation--------
lazyloadMovies();
//--------place searchbar on top when scrolling-----------
searchBarSticky();
//--------Open and close filter menu--------
filterMenu();
//--------Setup movie details modal--------
setupMovieModal();

// Remove the createPaginationDots() call - it will be called by fetchData after content loads
