import { lazyloadMovies } from "./scrollTiming.js";
import { fetchData } from "./fetchMovies.js";
import { searchBarSticky } from "./scrollTiming.js";
import { filterMenu } from "./filterMenu.js";
import { setupMovieModal } from "../moviesDetails/movieModal.js";
import { searchModal } from "../../components/search-modal.js";
import { fetchSearch } from "../../components/fetch-search.js";
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
//---------------search-modal--------------
searchModal();
//---------------fetch search value--------