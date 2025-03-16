//----------------funtion to play animation when movieCards comming to view------------
export function lazyloadMovies() {
	// Select ALL card containers
	const movieCards = document.querySelectorAll(".cardContainer");

	// Use Intersection Observer with optimized options
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					// Only add the class if it's not already there
					if (!entry.target.classList.contains("load")) {
						window.requestAnimationFrame(() => {
							entry.target.classList.add("load");

							// Preload images for this container after it's visible
							preloadContainerImages(entry.target);
						});
					}
				} else if (entry.boundingClientRect.y > 0) {
					// Only remove the class for containers that are below the viewport
					// This prevents "popping" when scrolling up
					window.requestAnimationFrame(() => {
						entry.target.classList.remove("load");
					});
				}
			});
		},
		{
			threshold: 0.1, // Trigger when at least 10% of the element is visible
			rootMargin: "100px 0px", // Start loading 100px before the element enters the viewport
		}
	);

	movieCards.forEach((card) => {
		if (card) {
			observer.observe(card);
		} else {
			console.error("Card element not found!");
		}
	});

	// Helper function to preload images in a container
	function preloadContainerImages(container) {
		const images = container.querySelectorAll(".moviesImg");

		// Use Intersection Observer for each image within the visible container
		const imageObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const img = entry.target;
						// Set higher priority for visible images
						img.fetchpriority = "high";
						imageObserver.unobserve(img);
					}
				});
			},
			{ threshold: 0.1 }
		);

		images.forEach((img) => {
			imageObserver.observe(img);
		});
	}
}

//------------function to put search par on top when scrolling----------
export function searchBarSticky() {
	const searchBar = document.querySelector(".searchSection");
	const seatImg = document.querySelector(".sentinel");
	const observer = new IntersectionObserver(
		([entry]) => {
			if (!entry.isIntersecting) {
				searchBar.classList.add("scrolled");
			} else {
				searchBar.classList.remove("scrolled");
			}
		},
		{
			root: null,
			threshold: 0,
			rootMargin: "10px",
		}
	);
	observer.observe(seatImg);
}
