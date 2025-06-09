import { findTrailer } from "./trailerFinder.js";
import config from "../../config/config.js";

export function setupMovieModal() {
	injectModalHTML();

	document.addEventListener("click", (e) => {
		if (e.target.classList.contains("buyBtn")) {
			const movieCard = e.target.closest(".movieCard");
			if (movieCard) {
				openMovieModal(movieCard);
			}
		}
	});

	document.addEventListener("click", (e) => {
		if (
			e.target.classList.contains("closeModalBtn") ||
			e.target.classList.contains("main-cont")
		) {
			closeMovieModal();
		}

		if (e.target.classList.contains("homeBtn")) {
			closeMovieModal();
		}
	});

	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape") {
			closeMovieModal();
		}
	});

	document.addEventListener("movieSelected", (event) => {
		const movie = event.detail.movie;
		if (movie) {
			const tempMovieCard = createTempMovieCard(movie);
			openMovieModal(tempMovieCard);
		}
	});
}

function createTempMovieCard(movie) {
	const tempCard = document.createElement("div");
	tempCard.className = "movieCard";

	const imageUrl = movie.primaryImage || "/src/pics/notFound.jpeg";
	const title = movie.primaryTitle || movie.originalTitle || "Title not found";
	const year = movie.releaseDate
		? movie.releaseDate.substring(0, 4)
		: movie.startYear || "Unknown";
	const rating =
		movie.ratingsSummary && movie.ratingsSummary.aggregateRating
			? parseFloat(movie.ratingsSummary.aggregateRating).toFixed(1)
			: "N/A";
	const runtime = movie.runtime ? `${movie.runtime} min` : "N/A";

	tempCard.innerHTML = `
		<img class="moviesImg" src="${imageUrl}" alt="${title} poster">
		<div class="cardInfo">
			<h3 class="moviesName">${title}</h3>
			<div class="movieInfo">
				<div class="rating">
					<span class="ratingNumber">${rating}</span>
				</div>
				<div class="year">
					<p class="yearNumber">${year}</p>
				</div>
				<div class="runtime">
					<p class="runtimeNumber">${runtime}</p>
				</div>
			</div>
		</div>
	`;

	return tempCard;
}

function injectModalHTML() {
	const modalHTML = `
    <div class="main-cont" style="display:none;">
        <div class="detail-modal">
            <button class="closeModalBtn">&times;</button>
            <div class="left-box">
                <img class="movieCover" src="" alt="Movie Cover" />
            </div>
            <div class="right-box">
                <h2 class="movie-title"></h2>
                <div class="movie-meta">
                    <span class="movie-year"><i class="fas fa-calendar-alt"></i> <span class="year-value"></span></span>
                    <span class="movie-rating"><i class="fas fa-star"></i> <span class="rating-value"></span></span>
                    <span class="movie-runtime"><i class="fas fa-clock"></i> <span class="runtime-value"></span></span>
                    <div class="movie-genres">
                        <!-- Genres will be dynamically inserted here -->
                    </div>
                </div>
                <iframe id="trailerFrame" allowfullscreen></iframe>
                <div class="info-box">
                    <p class="movie-description"></p>
                </div>
                <div class="btns-box">
                    <button class="homeBtn"><i class="fas fa-arrow-left"></i> Back to home</button>
                    <button class="watchListBtn"><i class="fas fa-plus"></i> Add to watch list</button>
                </div>
            </div>
        </div>
    </div>
    `;

	if (!document.querySelector(".main-cont")) {
		const modalContainer = document.createElement("div");
		modalContainer.innerHTML = modalHTML;
		document.body.appendChild(modalContainer.firstElementChild);
	}
}

function extractDominantColor(imageUrl) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = "Anonymous";
		img.onload = () => {
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");
			canvas.width = img.width;
			canvas.height = img.height;

			ctx.drawImage(img, 0, 0, img.width, img.height);

			const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			const data = imageData.data;
			const colorCounts = {};
			let dominantColor = { r: 90, g: 24, b: 154 };

			for (let i = 0; i < data.length; i += 20) {
				const r = data[i];
				const g = data[i + 1];
				const b = data[i + 2];

				if ((r < 30 && g < 30 && b < 30) || (r > 230 && g > 230 && b > 230))
					continue;

				const rgb = `${r},${g},${b}`;
				colorCounts[rgb] = (colorCounts[rgb] || 0) + 1;
			}

			let maxCount = 0;
			for (const color in colorCounts) {
				if (colorCounts[color] > maxCount) {
					maxCount = colorCounts[color];
					const [r, g, b] = color.split(",").map(Number);
					dominantColor = { r, g, b };
				}
			}

			resolve(dominantColor);
		};

		img.onerror = () => {
			reject(new Error("Failed to load image"));
			resolve({ r: 90, g: 24, b: 154 });
		};

		img.src = imageUrl;
	});
}

async function openMovieModal(movieCard) {
	const img = movieCard.querySelector(".moviesImg").src;
	const name = movieCard.querySelector(".moviesName").textContent;
	const rating = movieCard.querySelector(".ratingNumber").textContent;
	const year = movieCard.querySelector(".yearNumber").textContent;
	const runtime = movieCard.querySelector(".runtimeNumber").textContent;

	const modal = document.querySelector(".main-cont");
	const detailModal = modal.querySelector(".detail-modal");
	const movieCover = modal.querySelector(".movieCover");
	const movieTitle = modal.querySelector(".movie-title");
	const yearValue = modal.querySelector(".year-value");
	const ratingValue = modal.querySelector(".rating-value");
	const runtimeValue = modal.querySelector(".runtime-value");
	const movieDescription = modal.querySelector(".movie-description");
	const genresContainer = modal.querySelector(".movie-genres");

	genresContainer.innerHTML = "";

	movieCover.src = img;
	movieTitle.textContent = name;
	yearValue.textContent = year;
	ratingValue.textContent = rating;
	runtimeValue.textContent = runtime;
	movieDescription.textContent = "Loading description...";

	try {
		const dominantColor = await extractDominantColor(img);
		detailModal.style.background = `linear-gradient(
            135deg,
            rgba(${dominantColor.r}, ${dominantColor.g}, ${
			dominantColor.b
		}, 0.85) 0%,
            rgba(${Math.max(0, dominantColor.r - 48)}, ${Math.max(
			0,
			dominantColor.g - 48
		)}, ${Math.max(0, dominantColor.b - 48)}, 0.9) 100%
        )`;
	} catch (error) {
		console.error("Error extracting color:", error);
		// Fallback to default gradient
	}

	modal.style.display = "flex";
	document.body.style.overflow = "hidden";

	setTimeout(() => {
		modal.classList.add("active");
	}, 10);

	detailModal.style.transform = "translateY(20px)";
	setTimeout(() => {
		detailModal.style.transform = "translateY(0)";
	}, 50);

	try {
		const searchUrl = config.getTmdbSearchUrl(name);
		const searchResponse = await fetch(searchUrl);
		const searchData = await searchResponse.json();

		if (searchData.results && searchData.results.length > 0) {
			const movieId = searchData.results[0].id;
			const detailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`;

			const detailsResponse = await fetch(detailsUrl);
			const movieDetails = await detailsResponse.json();

			movieDescription.textContent =
				movieDetails.overview || "No description available.";

			if (movieDetails.genres && movieDetails.genres.length > 0) {
				genresContainer.innerHTML = "";

				const genreWrapper = document.createElement("span");
				genreWrapper.className = "movie-genre-wrapper";

				const genreIcon = document.createElement("i");
				genreIcon.className = "fas fa-tags";
				genreWrapper.appendChild(genreIcon);

				const genreTagsContainer = document.createElement("div");
				genreTagsContainer.className = "genre-tags";

				movieDetails.genres.forEach((genre) => {
					const genreTag = document.createElement("span");
					genreTag.className = "genre-tag";
					genreTag.textContent = genre.name;
					genreTagsContainer.appendChild(genreTag);
				});

				genreWrapper.appendChild(genreTagsContainer);
				genresContainer.appendChild(genreWrapper);
			} else {
				genresContainer.innerHTML = "";
			}
		} else {
			movieDescription.textContent = "No description available.";
			genresContainer.innerHTML = "";
		}
	} catch (error) {
		console.error("Error fetching movie details:", error);
		movieDescription.textContent = "Description unavailable.";
		genresContainer.innerHTML = "";
	}

	findTrailer(name);
}

function closeMovieModal() {
	const modal = document.querySelector(".main-cont");
	if (modal) {
		const detailModal = modal.querySelector(".detail-modal");
		detailModal.style.transform = "translateY(20px)";

		modal.classList.remove("active");

		setTimeout(() => {
			modal.style.display = "none";
			document.body.style.overflow = "auto";

			const trailerFrame = modal.querySelector("#trailerFrame");
			if (trailerFrame) {
				trailerFrame.src = "";
			}
		}, 300);
	}
}
