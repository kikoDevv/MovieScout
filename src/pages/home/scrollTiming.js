// Scroll-related functionality

export function lazyloadMovies() {
	// Function modified to remove .load animations
	console.log("Movie animations removed");
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
