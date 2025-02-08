import { lazyloadMovies } from "./scrollTiming.js";
import { fetchData } from "./fetchMovies.js";
//------------creates movie card and fetchs data from IMDB api-----------------
fetchData();
//-------lazy load movieCard animation--------
lazyloadMovies();