import { findTrailer } from "./trailerFinder.js";

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

function openMovieModal(movieCard) {
	const img = movieCard.querySelector(".moviesImg").src;
	const name = movieCard.querySelector(".moviesName").textContent;
	const rating = movieCard.querySelector(".ratingNumber").textContent;
	const year = movieCard.querySelector(".yearNumber").textContent;
	const runtime = movieCard.querySelector(".runtimeNumber").textContent;
	const description =
		movieCard.dataset.description || "Shittt, 404! No description available for this movie.";

	const modal = document.querySelector(".main-cont");
	const movieCover = modal.querySelector(".movieCover");
	const movieTitle = modal.querySelector(".movie-title");
	const yearValue = modal.querySelector(".year-value");
	const ratingValue = modal.querySelector(".rating-value");
	const runtimeValue = modal.querySelector(".runtime-value");
	const movieDescription = modal.querySelector(".movie-description");

	movieCover.src = img;
	movieTitle.textContent = name;
	yearValue.textContent = year;
	ratingValue.textContent = rating;
	runtimeValue.textContent = runtime;
	movieDescription.textContent = description;

	findTrailer(name);

	modal.style.display = "flex";
	document.body.style.overflow = "hidden";

	setTimeout(() => {
		modal.classList.add("active");
	}, 10);

	const detailModal = modal.querySelector(".detail-modal");
	detailModal.style.transform = "translateY(20px)";
	setTimeout(() => {
		detailModal.style.transform = "translateY(0)";
	}, 50);
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
