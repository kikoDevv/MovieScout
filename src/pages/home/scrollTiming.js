
let lastScrollPosition = window.scrollY;

export function lazyloadMovies() {
	const containers = document.querySelectorAll(".cardContainer");

	window.addEventListener("scroll", () => {
		lastScrollPosition = window.scrollY;
	});

	const revealOptions = {
		root: null,
		rootMargin: "20px",
		threshold: 0.15,
	};

	const revealCallback = (entries, observer) => {
		const scrollingDown = window.scrollY > lastScrollPosition;

		entries.forEach((entry) => {
			const container = entry.target;

			if (entry.isIntersecting) {
				if (scrollingDown) {
					container.classList.remove("reveal-container");
					const cards = container.querySelectorAll(".movieCard");
					cards.forEach((card) => {
						card.classList.remove("reveal-card");
					});

					setTimeout(() => {
						container.classList.add("reveal-container");

						cards.forEach((card, index) => {
							setTimeout(() => {
								card.classList.add("reveal-card");
							}, 100 + index * 50);
						});
					}, 50);
				} else {
					container.classList.add("reveal-container");
					const cards = container.querySelectorAll(".movieCard");
					cards.forEach((card) => {
						card.classList.add("reveal-card");
					});
				}
			} else {
				if (!scrollingDown) {
					if (entry.boundingClientRect.top > 0) {
						container.classList.remove("reveal-container");
						const cards = container.querySelectorAll(".movieCard");
						cards.forEach((card) => {
							card.classList.remove("reveal-card");
						});
					}
				}
			}
		});

		lastScrollPosition = window.scrollY;
	};

	const revealObserver = new IntersectionObserver(
		revealCallback,
		revealOptions
	);

	containers.forEach((container) => {
		container.classList.remove("reveal-container");
		const cards = container.querySelectorAll(".movieCard");
		cards.forEach((card) => {
			card.classList.remove("reveal-card");
		});

		revealObserver.observe(container);
	});

	const movieSection = document.querySelector(".moviesSection");
	if (movieSection) {
		const containerObserver = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				mutation.addedNodes.forEach((node) => {
					if (node.classList && node.classList.contains("cardContainer")) {
						revealObserver.observe(node);
					}
				});
			});
		});

		containerObserver.observe(movieSection, {
			childList: true,
			subtree: true,
		});
	}

	console.log("Card animations initialized");
}

export function searchBarSticky() {
	const searchSection = document.querySelector(".searchSection");
	const sentinel = document.querySelector(".sentinel");

	if (!searchSection || !sentinel) return;

	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (!entry.isIntersecting) {
				searchSection.classList.add("scrolled");
			} else {
				searchSection.classList.remove("scrolled");
			}
		});
	});

	observer.observe(sentinel);
}
