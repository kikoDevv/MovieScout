// Scroll-related functionality

// Track scroll position to determine direction
let lastScrollPosition = window.scrollY;

export function lazyloadMovies() {
	// Implement IntersectionObserver to detect when card containers come into view
	const containers = document.querySelectorAll(".cardContainer");

	// Track scroll direction
	window.addEventListener("scroll", () => {
		lastScrollPosition = window.scrollY;
	});

	const revealOptions = {
		root: null,
		rootMargin: "20px",
		threshold: 0.15, // Trigger when 15% of the container is visible
	};

	const revealCallback = (entries, observer) => {
		// Only apply animations when scrolling down
		const scrollingDown = window.scrollY > lastScrollPosition;

		entries.forEach((entry) => {
			const container = entry.target;

			// When container comes into view
			if (entry.isIntersecting) {
				// Only animate when scrolling down
				if (scrollingDown) {
					// Reset animation classes first
					container.classList.remove("reveal-container");
					const cards = container.querySelectorAll(".movieCard");
					cards.forEach((card) => {
						card.classList.remove("reveal-card");
					});

					// Then apply animation with a short delay
					setTimeout(() => {
						container.classList.add("reveal-container");

						// Stagger the reveal of each card inside
						cards.forEach((card, index) => {
							setTimeout(() => {
								card.classList.add("reveal-card");
							}, 100 + index * 50); // 50ms delay between each card
						});
					}, 50);
				} else {
					// When scrolling up, just make cards visible without animation
					container.classList.add("reveal-container");
					const cards = container.querySelectorAll(".movieCard");
					cards.forEach((card) => {
						card.classList.add("reveal-card");
					});
				}
			} else {
				// When container leaves viewport
				if (!scrollingDown) {
					// Only reset when scrolling up and element is above viewport
					if (entry.boundingClientRect.top > 0) {
						// Reset animation classes
						container.classList.remove("reveal-container");
						const cards = container.querySelectorAll(".movieCard");
						cards.forEach((card) => {
							card.classList.remove("reveal-card");
						});
					}
				}
			}
		});

		// Update last scroll position
		lastScrollPosition = window.scrollY;
	};

	const revealObserver = new IntersectionObserver(
		revealCallback,
		revealOptions
	);

	containers.forEach((container) => {
		// Reset animation classes initially
		container.classList.remove("reveal-container");
		const cards = container.querySelectorAll(".movieCard");
		cards.forEach((card) => {
			card.classList.remove("reveal-card");
		});

		revealObserver.observe(container);
	});

	// Also handle new containers that might be added dynamically
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
	// Existing searchbar sticky functionality
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
