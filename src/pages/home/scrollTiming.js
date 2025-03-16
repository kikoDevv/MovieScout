//----------------funtion to play animation when movieCards comming to view------------
export function lazyloadMovies() {
	const movieCards = document.querySelectorAll(".cardContainer");

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					if (!entry.target.classList.contains("load")) {
						window.requestAnimationFrame(() => {
							entry.target.classList.add("load");

							preloadContainerImages(entry.target);
						});
					}
				} else if (entry.boundingClientRect.y > 0) {

					window.requestAnimationFrame(() => {
						entry.target.classList.remove("load");
					});
				}
			});
		},
		{
			threshold: 0.1,
			rootMargin: "100px 0px",
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

		const imageObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const img = entry.target;
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
