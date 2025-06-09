import { createMovieCard } from "./createMovieCard.js";
import { createPaginationDots } from "./scrollIndicator.js";
import config from "../../config/config.js";

function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

const containersToLoad = ["#topTen", "#topTvShows", "#newReleased"];
let loadedContainers = 0;
let allInitialized = false;

function renderMovieCards(movies, containerId, batchSize = 5) {
	const container = document.querySelector(containerId);

	container.innerHTML = "";
	container.classList.remove("reveal-container");

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
		} else {
			console.log(`Finished rendering ${containerId}`);

			if (containerId === "#newReleased") {
				setTimeout(() => {
					if (
						!container.nextElementSibling?.classList.contains(
							"pagination-container"
						)
					) {
						console.log("Force initializing pagination for #newReleased");
						initializeContainerPagination(container);
					}
				}, 100);
			}

			checkAllContainersLoaded();
		}
	};

	renderBatch(0);
}

function checkAllContainersLoaded() {
	loadedContainers++;
	console.log(
		`Container loaded: ${loadedContainers}/${containersToLoad.length}`
	);

	if (loadedContainers >= containersToLoad.length && !allInitialized) {
		allInitialized = true;
		console.log("All containers loaded, initializing pagination");

		createPaginationDots();

		containersToLoad.forEach((id) => {
			const container = document.querySelector(id);
			if (container) {
				initializeContainerPagination(container);
			}
		});

		let retryCount = 0;
		const maxRetries = 3;

		function retryPagination() {
			if (retryCount >= maxRetries) return;

			retryCount++;
			console.log(`Pagination safety check attempt ${retryCount}`);

			setTimeout(() => {
				containersToLoad.forEach((id) => {
					const container = document.querySelector(id);
					if (
						container &&
						(!container.nextElementSibling ||
							!container.nextElementSibling.classList.contains(
								"pagination-container"
							))
					) {
						console.log(`Reinitializing missing pagination for ${id}`);
						initializeContainerPagination(container);
					}
				});

				retryPagination();
			}, 500 * retryCount);
		}

		retryPagination();
	}
}

function initializeContainerPagination(container) {
	if (container) {
		import("./scrollIndicator.js").then((module) => {
			if (typeof module.setupPagination === "function") {
				module.setupPagination(container);
			} else {
				createPaginationDots();
			}
		});
	}
}

//----------function to fetch data from api-------
export async function fetchData() {
	// Reset counters when starting new fetch
	loadedContainers = 0;
	allInitialized = false;

	const urlMoves = config.getMoviesUrl();
	const urlTvShows = config.getTvShowsUrl();
	const options = {
		method: "GET",
		headers: config.getApiHeaders(),
	};

	console.log("Fetching movies from:", urlMoves); // Debug log
	console.log("Fetching TV shows from:", urlTvShows); // Debug log

	try {
		//---------------get top movies--------------
		const response = await fetch(urlMoves, options);
		console.log("Movies response status:", response.status); // Debug log

		if (!response.ok) {
			throw new Error(
				`Movies API error: ${response.status} ${response.statusText}`
			);
		}

		const data = await response.json();
		console.log("Movies API response:", data); // Debug log

		// Check if data has the expected structure
		if (!data || !Array.isArray(data)) {
			console.error("Invalid movies data structure:", data);
			throw new Error("Invalid movies data structure received");
		}

		const topRatedMovies = data.sort(
			(a, b) => (b.averageRating || 0) - (a.averageRating || 0)
		);
		const random30Movies = shuffleArray(topRatedMovies).slice(0, 30);

		//---------------create movie cards from random 30 movies-----------
		renderMovieCards(random30Movies, "#topTen");

		//---------get top tv shows----------------
		const responseTvShow = await fetch(urlTvShows, options);
		console.log("TV shows response status:", responseTvShow.status); // Debug log

		if (!responseTvShow.ok) {
			throw new Error(
				`TV shows API error: ${responseTvShow.status} ${responseTvShow.statusText}`
			);
		}

		const tvShowData = await responseTvShow.json();
		console.log("TV shows API response:", tvShowData); // Debug log

		// Check if tvShowData has the expected structure
		if (!tvShowData || !Array.isArray(tvShowData)) {
			console.error("Invalid TV shows data structure:", tvShowData);
			throw new Error("Invalid TV shows data structure received");
		}

		const topTvShows = tvShowData
			.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
			.slice(0, 30);

		//--------------generate tv shows cards----------------
		renderMovieCards(topTvShows, "#topTvShows");

		//-----------get new release movies------------------
		const newReleased = data
			.sort((a, b) => (b.startYear || 0) - (a.startYear || 0))
			.slice(0, 30);

		renderMovieCards(newReleased, "#newReleased");
	} catch (error) {
		console.error("Fetch error details:", error);

		// Handle error case by marking containers as loaded
		containersToLoad.forEach((id) => {
			const container = document.querySelector(id);
			if (container) {
				checkAllContainersLoaded();
			}
		});
	}

	setTimeout(() => {
		if (!allInitialized) {
			console.log("Safety timeout: forcing pagination initialization");
			createPaginationDots();
			allInitialized = true;
		}
	}, 5000);
}
