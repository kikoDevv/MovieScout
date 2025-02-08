import { lazyloadMovies } from "./scrollTiming.js";
import { fetchData } from "./fetchMovies.js";
import { filterMenuAnimation } from "./scrollTiming.js";
//------------creates movie card and fetchs data from IMDB api-----------------
fetchData();
//-------lazy load movieCard animation--------
lazyloadMovies();
//------animation for filterment---------
filterMenuAnimation();
//-----animation for search bar to stay on top-----------
searchBarSticky();
function searchBarSticky() {
  const searchBar = document.querySelector(".searchSection");
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) {
        searchBar.classList.add("scrolled");
      } else {
        searchBar.classList.remove("scrolled");
      }
    },
    {
      root: null,
      threshold: 0, // Trigger as soon as any part crosses our adjusted margin
      // Adjust the top margin to trigger 10px before the searchBar actually reaches the top
      rootMargin: "-60px 0px 0px 0px",
    }
  );
  observer.observe(searchBar);
}
// searchBarSticky();
