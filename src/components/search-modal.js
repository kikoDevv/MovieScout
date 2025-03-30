import { fetchSearch } from "./fetch-search.js";

export function searchModal() {
	const searchSection = document.querySelector(".searchSection");
	const searchModal = document.createElement("div");
	searchModal.classList.add("search-modal");
	searchSection.appendChild(searchModal);

	//---------listen for input from searchbar--------
	const searchInput = document.querySelector(".searchBar");
	let debounceTimer;
	let selectedIndex = -1;
	let searchResults = [];

	document.addEventListener("click", (e) => {
		if (!searchModal.contains(e.target) && e.target !== searchInput) {
			searchModal.classList.remove("active");
			searchInput.value = "";
		}
	});

	searchInput.addEventListener("input", (e) => {
		const searchValue = e.target.value.trim();
		clearTimeout(debounceTimer);

		selectedIndex = -1;

		if (!searchValue) {
			searchModal.innerHTML = "";
			searchModal.classList.remove("active");
			return;
		}

		searchModal.innerHTML = "";
		searchModal.classList.add("active");
		const loadingCard = createLoadingCard();
		searchModal.appendChild(loadingCard);

		debounceTimer = setTimeout(() => performSearch(searchValue), 500);
	});

	//------------keyboard navigation----------
	searchInput.addEventListener("keydown", (e) => {
		if (!searchModal.classList.contains("active")) return;

		switch (e.key) {
			case "ArrowDown":
				e.preventDefault();
				navigateResults(1);
				break;
			case "ArrowUp":
				e.preventDefault();
				navigateResults(-1);
				break;
			case "Enter":
				e.preventDefault();
				if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
					handleResultSelection(searchResults[selectedIndex]);
				}
				break;
			case "Escape":
				searchModal.classList.remove("active");
				break;
		}
	});

	searchInput.addEventListener("focus", () => {
		if (searchInput.value.trim() && searchModal.children.length > 0) {
			searchModal.classList.add("active");
		}
	});

	async function performSearch(searchValue) {
		try {
			const response = await fetchSearch(searchValue);
			console.log("search results:", response);

			searchModal.innerHTML = "";

			if (response && response.results && response.results.length > 0) {
				searchResults = response.results.slice(0, 6);

				//-------show result
				searchResults.forEach((movie, index) => {
					const imageUrl = movie.primaryImage || "/src/pics/notFound.jpeg";
					const year = movie.releaseDate || movie.startYear || "Unknown year";
					const title =
						movie.primaryTitle || movie.originalTitle || "Title not found";

					// Extract additional information
					const type = getContentType(movie);
					const runtime = getRuntime(movie);
					const rating = getRating(movie);

					const searchCard = createSearchCard(
						imageUrl,
						title,
						year,
						type,
						runtime,
						rating
					);
					//-----click even for each card
					searchCard.addEventListener("click", () => {
						handleResultSelection(movie);
					});

					searchModal.appendChild(searchCard);
				});
			} else {
				const noResultsCard = createNoResultsCard();
				searchModal.appendChild(noResultsCard);
			}
		} catch (error) {
			console.error("Error processing search:", error);
			searchModal.innerHTML = "";
			const errorCard = createErrorCard();
			searchModal.appendChild(errorCard);
		}
	}

	function getContentType(movie) {
		if (!movie) return null;

		if (movie.titleType) {
			const type = movie.titleType.toLowerCase();
			if (type.includes("tv") || type.includes("series")) return "TV Show";
			if (type.includes("mini") && type.includes("series"))
				return "Mini Series";
			if (type.includes("movie")) return "Movie";
			if (type.includes("short")) return "Short";
		}

		if (movie.numberOfEpisodes || movie.numberOfSeasons) return "TV Show";

		if (
			movie.runtime &&
			movie.runtime < 35 &&
			movie.titleType?.toLowerCase().includes("episode")
		)
			return "TV Show";

		return "Movie";
	}

	function getRuntime(movie) {
		if (!movie || !movie.runtime) return null;

		if (typeof movie.runtime === "number") {
			return `${movie.runtime} min`;
		}

		return movie.runtime;
	}

	function getRating(movie) {
		if (!movie) return null;

		if (movie.ratingsSummary && movie.ratingsSummary.aggregateRating) {
			return movie.ratingsSummary.aggregateRating;
		}

		return null;
	}

	//-----------key board navigation func-----------
	function navigateResults(direction) {
		const cards = searchModal.querySelectorAll(
			".search-card:not(.loading):not(.no-results):not(.error)"
		);
		if (!cards.length) return;

		if (selectedIndex >= 0 && selectedIndex < cards.length) {
			cards[selectedIndex].classList.remove("selected");
		}

		selectedIndex += direction;
		if (selectedIndex < 0) selectedIndex = cards.length - 1;
		if (selectedIndex >= cards.length) selectedIndex = 0;

		cards[selectedIndex].classList.add("selected");
		cards[selectedIndex].scrollIntoView({ block: "nearest" });
	}
	//---------------on click takes user to movie details modal---------
	function handleResultSelection(movie) {
		console.log("Selected movie:", movie);

		searchModal.classList.remove("active");

		const event = new CustomEvent("movieSelected", {
			detail: { movieId: movie.id, movie: movie },
		});
		document.dispatchEvent(event);
	}

	function createLoadingCard() {
		const loadingCard = document.createElement("div");
		loadingCard.classList.add("search-card", "loading");

		for (let i = 0; i < 3; i++) {
			const skeleton = document.createElement("div");
			skeleton.classList.add("skeleton-loader");
			loadingCard.appendChild(skeleton);
		}

		return loadingCard;
	}

	function createNoResultsCard() {
		const noResultsCard = document.createElement("div");
		noResultsCard.classList.add("search-card", "no-results");

		const icon = document.createElement("i");
		icon.classList.add("fas", "fa-search");

		const message = document.createElement("p");
		message.textContent = "No results found";

		noResultsCard.appendChild(icon);
		noResultsCard.appendChild(message);

		return noResultsCard;
	}

	function createErrorCard() {
		const errorCard = document.createElement("div");
		errorCard.classList.add("search-card", "error");

		const icon = document.createElement("i");
		icon.classList.add("fas", "fa-exclamation-circle");

		const message = document.createElement("p");
		message.textContent = "Something went wrong. Please try again.";

		errorCard.appendChild(icon);
		errorCard.appendChild(message);

		return errorCard;
	}

	function createSearchCard(img, title, year, type, runtime, rating) {
		const searchCard = document.createElement("div");
		searchCard.classList.add("search-card");

		const searchImg = document.createElement("img");
		searchImg.classList.add("search-img");
		searchImg.src = img;
		searchImg.alt = "Movie poster";
		searchImg.onerror = () => {
			searchImg.src = "/src/pics/notFound.jpeg";
		};

		const searchInfoCont = document.createElement("div");
		searchInfoCont.classList.add("search-info-container");

		const searchedTitle = document.createElement("p");
		searchedTitle.classList.add("searched-title");
		searchedTitle.textContent = title;

		const boxInfo = document.createElement("div");
		boxInfo.classList.add("boxInfo");

		if (type) {
			const typeElement = document.createElement("span");
			typeElement.classList.add("searched-type");

			// Add content-specific styling
			typeElement.classList.add(
				type === "TV Show" ? "tv-show-badge" : "movie-badge"
			);

			typeElement.textContent = type;
			boxInfo.appendChild(typeElement);
		}

		const searchedYear = document.createElement("p");
		searchedYear.classList.add("searched-year");

		let yearText = "N/A";
		if (year && year !== "Unknown year") {
			if (typeof year === "string" && year.includes("-")) {
				yearText = year.substring(0, 4);
			} else {
				yearText = year;
			}
		}
		searchedYear.textContent = yearText;
		boxInfo.appendChild(searchedYear);

		if (runtime) {
			const runtimeElement = document.createElement("p");
			runtimeElement.classList.add("searched-runtime");
			runtimeElement.textContent = runtime;
			boxInfo.appendChild(runtimeElement);
		}

		if (rating) {
			const ratingElement = document.createElement("div");
			ratingElement.classList.add("searched-rating");

			const starIcon = document.createElement("i");
			starIcon.classList.add("fas", "fa-star");

			const ratingText = document.createElement("span");
			ratingText.textContent = parseFloat(rating).toFixed(1);

			ratingElement.appendChild(starIcon);
			ratingElement.appendChild(ratingText);
			boxInfo.appendChild(ratingElement);
		}

		searchCard.appendChild(searchImg);
		searchCard.appendChild(searchInfoCont);
		searchInfoCont.appendChild(searchedTitle);
		searchInfoCont.appendChild(boxInfo);

		return searchCard;
	}
}
