import { lazyloadMovies } from "./scrollTiming.js";
import { fetchData } from "./fetchMovies.js";
import { searchBarSticky } from "./scrollTiming.js";
import { filterMenu } from "./filterMenu.js";
import { createPaginationDots } from "./scrollIndicator.js";
import { setupMovieModal } from "../moviesDetails/movieModal.js";

//------------creates movie card and fetchs data from IMDB api-----------------
fetchData();
//-------lazy load movieCard animation--------
lazyloadMovies();
//--------place searchbar on top when scrolling-----------
searchBarSticky();
//--------Open and close filter menu--------
filterMenu();
//--------Create pagination dots for all cardContainers--------
createPaginationDots();
//--------Setup movie details modal--------
setupMovieModal();
