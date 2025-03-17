import { createMovieCard } from "./createMovieCard.js";

function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

function renderMovieCards(movies, containerId, batchSize = 5) {
	const container = document.querySelector(containerId);

	container.innerHTML = "";

	const fragment = document.createDocumentFragment();

	const renderBatch = (startIndex) => {
		const endIndex = Math.min(startIndex + batchSize, movies.length);

		for (let i = startIndex; i < endIndex; i++) {
			const movie = movies[i];
			const card = document.createElement("div");
			card.className = "movieCard";
			card.innerHTML = `
				<img
					class="moviesImg"
					src="${movie.primaryImage}"
					alt="movie image not found"
					loading="lazy"
					decoding="async"
					fetchpriority="low"
					onerror="this.onerror=null;this.src='/MovieScout/src/pics/notFound.jpeg';" />
				<div class="cardInfo">
					<h3 class="moviesName">${movie.originalTitle || "Shitt, 404!"}</h3>
					<div class="movieInfo">
						<div class="rating">
							<i class="fa-brands fa-imdb fa-1xl"></i>
							<p class="ratingNumber">${movie.averageRating || "404!"}</p>
						</div>
						<div class="year">
							<i class="fa-regular fa-calendar-plus"></i>
							<p class="yearNumber">${movie.startYear || "404!"}</p>
						</div>
						<div class="runtime">
							<i class="fa-regular fa-hourglass-half"></i>
							<p class="runtimeNumber">${movie.runtimeMinutes || "404!"} min</p>
						</div>
					</div>
					<button class="buyBtn">About movie</button>
				</div>
			`;
			fragment.appendChild(card);
		}

		container.appendChild(fragment);

		if (endIndex < movies.length) {
			window.requestAnimationFrame(() => {
				renderBatch(endIndex);
			});
		}
	};

	renderBatch(0);
}

//----------function to fetch data from api-------
export async function fetchData() {
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
		const topRatedMovies = data.sort(
			(a, b) => b.averageRating - a.averageRating
		);
		const random30Movies = shuffleArray(topRatedMovies).slice(0, 30);

		//---------------create movie cards from random 30 movies-----------
		renderMovieCards(random30Movies, "#topTen");

		//---------get top tv shows----------------
		const responseTvShow = await fetch(urlTvShows, options);
		const tvShowData = await responseTvShow.json();
		const topTvShows = tvShowData
			.sort((a, b) => b.averageRating - a.averageRating)
			.slice(0, 30);

		//--------------generate tv shows cards----------------
		renderMovieCards(topTvShows, "#topTvShows");

		//-----------get new release movies------------------
		const newReleased = data
			.sort((a, b) => b.startYear - a.startYear)
			.slice(0, 30);

		renderMovieCards(newReleased, "#newReleased");
	} catch (error) {
		console.error(error);
	}
}
