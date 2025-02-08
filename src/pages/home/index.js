import { lazyloadMovies } from "./scrollTiming.js";
import { fetchData } from "./fetchMovies.js";
import { filterMenuAnimation } from "./scrollTiming.js";
import { searchBarSticky } from "./scrollTiming.js";
//------------creates movie card and fetchs data from IMDB api-----------------
fetchData();
//-------lazy load movieCard animation--------
lazyloadMovies();
//------animation for filterment---------
filterMenuAnimation();
//--------place searchbar on top when scrolling-----------
searchBarSticky();
