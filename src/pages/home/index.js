import {lazyloadMovies} from "./scrollTiming.js";

document.addEventListener("DOMContentLoaded", () => {
	const filterBtn = document.querySelector(".filterBtn");
	const filterMenu = document.querySelector(".filterMenu");
	const cardContainer = document.querySelector(".cardContainer");
	// Event listener for filter menu toggle
	filterBtn.addEventListener("click", () => {
		if (filterMenu.classList.value === "filterMenu") {
			filterMenu.classList.remove("filterMenu");
			filterBtn.classList.remove("fa-solid");
			filterBtn.classList.remove("fa-xmark");
			filterMenu.classList.add("hidden");
			filterBtn.textContent = "Filter movies";
		} else {
			filterMenu.classList.remove("hidden");
			filterMenu.classList.add("filterMenu");
			filterBtn.textContent = "";
			filterBtn.classList.add("fa-solid");
			filterBtn.classList.add("fa-xmark");
			filterBtn.classList.add("fa-2xl");
		}
	});

	// Codeblock for search bar
	const searchSection = document.querySelector(".searchSection");
	const initialTop = searchSection.offsetTop;

	window.addEventListener("scroll", () => {
		if (window.scrollY >= initialTop + 160) {
			searchSection.style.position = "fixed";
			searchSection.style.top = "30px";
		} else {
			searchSection.style.position = "absolute";
			searchSection.style.top = "45%";
			searchSection.style.minWidth = "40vw";
		}
	});
});
//------------movie api-----------------
fetchData();
//----------function to fetch data from api-------
async function fetchData() {
	const urlMoves = "https://imdb236.p.rapidapi.com/imdb/most-popular-movies";
	const urlTvShows = "https://imdb236.p.rapidapi.com/imdb/most-popular-tv";
	const options = {
		method: "GET",
		headers: {
			"x-rapidapi-key": "07807008b3msh7188004c6c5cd67p18ca7bjsnbc847e4ae696",
			"x-rapidapi-host": "imdb236.p.rapidapi.com",
		},
	};
	try {
		//---------------get top movies--------------
		const response = await fetch(urlMoves, options);
		const data = await response.json();
		const topRatedMovies = data
			.sort((a, b) => b.averageRating - a.averageRating)
			.slice(0, 30);
		//---------------create movie card from api for top ten-----------
		topRatedMovies.forEach((movie) => {
			createMovieCard(
				movie.primaryImage,
				movie.originalTitle,
				movie.averageRating,
				movie.startYear,
				movie.runtimeMinutes,
				"#topTen"
			);
		});
		//---------get top tv shows----------------
		const responseTvShow = await fetch(urlTvShows, options);
		const tvShowData = await responseTvShow.json();
		const topTvShows = tvShowData
			.sort((a, b) => b.averageRating - a.averageRating)
			.slice(0, 30);
		//--------------generate tv shows card----------------
		topTvShows.forEach((tvShow) => {
			createMovieCard(
				tvShow.primaryImage,
				tvShow.originalTitle,
				tvShow.averageRating,
				tvShow.startYear,
				tvShow.runtimeMinutes,
				"#topTvShows"
			);
		});
		//-----------get new release------------------
		const newReleased = data
			.sort((a, b) => b.startYear - a.startYear)
			.slice(0, 30);
		newReleased.forEach((newR) => {
			createMovieCard(
				newR.primaryImage,
				newR.originalTitle,
				newR.averageRating,
				newR.startYear,
				newR.runtime,
				"#newReleased"
			);
		});
	} catch (error) {
		console.error(error);
	}
}

//------------function create movie card----------------
function createMovieCard(img, name, rating, year, runtime, container) {
	const cardContainer = document.querySelector(container);
	// const fallbackImage = "src/pics/notFound.jpeg";
	const fallbackImage = "/src/pics/notFound.jpeg";
	const fallbackName = "Shitt, 404!";
	const fallback = "404!";
	const movieCardHTML = `
        <div class="movieCard">
            <img
                class="moviesImg"
                src="${img}"
                alt="movie image not found"
                onerror="this.onerror=null;this.src='${fallbackImage}';" />
            <div class="cardInfo">
                <h3 class="moviesName">${name || fallbackName}</h3>
                <div class="movieInfo">
                    <div class="rating">
                        <i class="fa-brands fa-imdb fa-1xl"></i>
                        <p class="ratingNumber">${rating || fallback}</p>
                    </div>
                    <div class="year">
                        <i class="fa-regular fa-calendar-plus"></i>
                        <p class="yearNumber">${year || fallback}</p>
                    </div>
                    <div class="runtime">
                        <i class="fa-regular fa-hourglass-half"></i>
                        <p class="runtimeNumber">${runtime || fallback} min</p>
                    </div>
                </div>
                <button class="buyBtn">+ whatch list</button>
            </div>
        </div>
    `;
	cardContainer.innerHTML += movieCardHTML;
}
lazyloadMovies();
