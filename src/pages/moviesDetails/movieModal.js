import { findTrailer } from "./trailerFinder.js";

export function setupMovieModal() {
	// Inject the modal HTML into the page
	injectModalHTML();

	// Set up event delegation for all buy buttons
	document.addEventListener("click", (e) => {
		if (e.target.classList.contains("buyBtn")) {
			// Get the parent movie card to extract data
			const movieCard = e.target.closest(".movieCard");
			if (movieCard) {
				openMovieModal(movieCard);
			}
		}
	});

	// Set up close functionality
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
                    <span class="movie-year"></span>
                    <span class="movie-rating"></span>
                    <span class="movie-runtime"></span>
                </div>
                <iframe id="trailerFrame" allowfullscreen></iframe>
                <div class="info-box">
                    <p class="movie-description"></p>
                </div>
                <div class="btns-box">
                    <button class="homeBtn">Back to home</button>
                    <button class="watchListBtn">Add to watch list</button>
                </div>
            </div>
        </div>
    </div>
    `;

	// Append modal HTML to body if it doesn't already exist
	if (!document.querySelector(".main-cont")) {
		const modalContainer = document.createElement("div");
		modalContainer.innerHTML = modalHTML;
		document.body.appendChild(modalContainer.firstElementChild);
	}
}

function openMovieModal(movieCard) {
	// Extract data from the movie card
	const img = movieCard.querySelector(".moviesImg").src;
	const name = movieCard.querySelector(".moviesName").textContent;
	const rating = movieCard.querySelector(".ratingNumber").textContent;
	const year = movieCard.querySelector(".yearNumber").textContent;
	const runtime = movieCard.querySelector(".runtimeNumber").textContent;

	// Get modal elements
	const modal = document.querySelector(".main-cont");
	const movieCover = modal.querySelector(".movieCover");
	const movieTitle = modal.querySelector(".movie-title");
	const movieYear = modal.querySelector(".movie-year");
	const movieRating = modal.querySelector(".movie-rating");
	const movieRuntime = modal.querySelector(".movie-runtime");

	// Set modal content
	movieCover.src = img;
	movieTitle.textContent = name;
	movieYear.textContent = year;
	movieRating.textContent = `IMDb: ${rating}`;
	movieRuntime.textContent = runtime;

	// Find and load trailer
	findTrailer(name);

	// Show the modal
	modal.style.display = "flex";
	document.body.style.overflow = "hidden"; // Prevent scrolling

	// Add animation class
	setTimeout(() => {
		modal.classList.add("active");
	}, 10);
}

function closeMovieModal() {
	const modal = document.querySelector(".main-cont");
	if (modal) {
		modal.classList.remove("active");
		setTimeout(() => {
			modal.style.display = "none";
			document.body.style.overflow = "auto"; // Re-enable scrolling
		}, 300); // Match transition duration
	}
}
