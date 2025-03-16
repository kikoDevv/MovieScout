export function createPaginationDots() {
	initPagination();
	// Add window resize listener to recalculate pagination
	window.addEventListener(
		"resize",
		debounce(() => {
			initPagination();
		}, 250)
	);

	// Second check to ensure pagination is properly set up after content loads
	setTimeout(() => {
		initPagination();
	}, 2000);
}

/**
 * Initializes pagination for movie containers
 */
function initPagination() {
	// Apply pagination to all movie containers
	const movieContainers = document.querySelectorAll(".cardContainer");
	movieContainers.forEach((container) => {
		if (container.id) {
			setupPagination(container);
		}
	});
}

/**
 * Sets up pagination for a specific container
 */
function setupPagination(container) {
	// Wait for content to be loaded
	if (!container.classList.contains("load")) {
		setTimeout(() => setupPagination(container), 500);
		return;
	}

	// Remove any existing pagination
	const existingPagination = container.nextElementSibling;
	if (
		existingPagination &&
		(existingPagination.classList.contains("pagination-dots") ||
			existingPagination.classList.contains("pagination-container"))
	) {
		existingPagination.remove();
	}

	// Calculate how many pages we need based on visible cards
	const containerWidth = container.offsetWidth;
	const scrollWidth = container.scrollWidth;

	// If no scrolling needed, don't add pagination
	if (scrollWidth <= containerWidth) return;

	// Calculate number of "pages" more accurately based on viewport
	const viewportWidth = window.innerWidth;
	let cardWidth = 320; // default card width with gap

	// Adjust card width estimation based on viewport
	if (viewportWidth < 768) {
		cardWidth = 280; // Smaller screens
	} else if (viewportWidth > 1440) {
		cardWidth = 360; // Larger screens
	}

	const visibleCards = Math.max(1, Math.floor(containerWidth / cardWidth));
	const totalCards = container.childElementCount;
	const numPages = Math.ceil(totalCards / visibleCards);

	// Store original scroll width for calculations
	container.dataset.totalWidth = scrollWidth.toString();
	container.dataset.viewWidth = containerWidth.toString();
	container.dataset.numPages = numPages.toString();

	// Create main pagination container
	const paginationContainer = document.createElement("div");
	paginationContainer.classList.add("pagination-container");
	paginationContainer.setAttribute("aria-label", "Pagination controls");
	paginationContainer.dataset.containerId = container.id;

	// Add data attribute to track if scroll is happening
	paginationContainer.dataset.scrolling = "false";

	// Add left arrow
	const leftArrow = document.createElement("div");
	leftArrow.classList.add("nav-arrow", "left-arrow", "disabled");
	leftArrow.innerHTML = '<i class="fas fa-chevron-left"></i>';
	leftArrow.setAttribute("role", "button");
	leftArrow.setAttribute("aria-label", "Previous page");
	leftArrow.setAttribute("tabindex", "0");
	paginationContainer.appendChild(leftArrow);

	// Create dots container
	const dotsContainer = document.createElement("div");
	dotsContainer.classList.add("pagination-dots");

	// Create dots based on number of pages
	for (let i = 0; i < numPages; i++) {
		const dot = document.createElement("button"); // Changed to button element for better click handling
		dot.classList.add("dot");
		dot.dataset.page = i;
		dot.setAttribute("type", "button");
		dot.setAttribute("aria-label", `Page ${i + 1}`);
		if (i === 0) {
			dot.classList.add("active");
			dot.setAttribute("aria-current", "true");
		}
		dotsContainer.appendChild(dot);
	}

	paginationContainer.appendChild(dotsContainer);

	// Add right arrow
	const rightArrow = document.createElement("div");
	rightArrow.classList.add("nav-arrow", "right-arrow");
	rightArrow.innerHTML = '<i class="fas fa-chevron-right"></i>';
	rightArrow.setAttribute("role", "button");
	rightArrow.setAttribute("aria-label", "Next page");
	rightArrow.setAttribute("tabindex", "0");
	paginationContainer.appendChild(rightArrow);

	// Insert pagination after the container
	container.insertAdjacentElement("afterend", paginationContainer);

	// Use event delegation for better click handling
	paginationContainer.addEventListener("click", (event) => {
		// Prevent action if scrolling is in progress
		if (paginationContainer.dataset.scrolling === "true") {
			event.preventDefault();
			return;
		}

		const target = event.target;

		// Handle dot clicks
		if (target.classList.contains("dot")) {
			const pageIndex = parseInt(target.dataset.page);
			scrollToPage(container, pageIndex);
			return;
		}

		// Handle left arrow clicks
		if (
			target.classList.contains("left-arrow") ||
			target.closest(".left-arrow")
		) {
			if (!leftArrow.classList.contains("disabled")) {
				const activeDot = dotsContainer.querySelector(".dot.active");
				const currentPage = parseInt(activeDot.dataset.page);
				scrollToPage(container, currentPage - 1);
				return;
			}
		}

		// Handle right arrow clicks
		if (
			target.classList.contains("right-arrow") ||
			target.closest(".right-arrow")
		) {
			if (!rightArrow.classList.contains("disabled")) {
				const activeDot = dotsContainer.querySelector(".dot.active");
				const currentPage = parseInt(activeDot.dataset.page);
				scrollToPage(container, currentPage + 1);
				return;
			}
		}
	});

	// Add keyboard navigation
	paginationContainer.addEventListener("keydown", (e) => {
		// Prevent action if scrolling is in progress
		if (paginationContainer.dataset.scrolling === "true") {
			e.preventDefault();
			return;
		}

		const activeDot = dotsContainer.querySelector(".dot.active");
		const currentPage = parseInt(activeDot.dataset.page);

		if (e.key === "ArrowLeft" && currentPage > 0) {
			scrollToPage(container, currentPage - 1);
		} else if (e.key === "ArrowRight" && currentPage < numPages - 1) {
			scrollToPage(container, currentPage + 1);
		}
	});

	// Fix for the edge case with the last page - track scroll progress accurately
	container.addEventListener(
		"scroll",
		debounce(() => {
			// Don't update if we're in the middle of a programmatic scroll
			if (paginationContainer.dataset.scrolling === "true") return;

			const scrollPos = container.scrollLeft;
			const containerWidth = parseFloat(container.dataset.viewWidth);
			const scrollWidth = parseFloat(container.dataset.totalWidth);
			const scrollableWidth = scrollWidth - containerWidth;
			const numPages = parseInt(container.dataset.numPages);

			// Calculate which dot should be active
			let activeDotIndex;

			// Improved edge case detection
			if (scrollPos <= 5) {
				// Near the beginning
				activeDotIndex = 0;
			} else if (scrollPos + containerWidth >= scrollWidth - 5) {
				// Near the end
				activeDotIndex = numPages - 1;
			} else {
				// Calculate position - use interpolation for smoother transitions
				const scrollPercentage = scrollPos / scrollableWidth;
				activeDotIndex = Math.min(
					Math.round(scrollPercentage * (numPages - 1)),
					numPages - 1
				);
			}

			updateActiveDot(dotsContainer, activeDotIndex);

			// Update arrow states
			leftArrow.classList.toggle("disabled", activeDotIndex === 0);
			rightArrow.classList.toggle("disabled", activeDotIndex === numPages - 1);
		}, 100)
	);
}

/**
 * Scrolls to a specific page
 */
function scrollToPage(container, pageIndex) {
	const paginationContainer = container.nextElementSibling;
	if (!paginationContainer) return;

	const dotsContainer = paginationContainer.querySelector(".pagination-dots");
	const leftArrow = paginationContainer.querySelector(".left-arrow");
	const rightArrow = paginationContainer.querySelector(".right-arrow");
	const numPages = parseInt(container.dataset.numPages);

	if (pageIndex < 0 || pageIndex >= numPages) return;

	// Set flag to indicate scrolling is happening
	paginationContainer.dataset.scrolling = "true";

	// Calculate precise scroll position based on real container width
	const containerWidth = parseFloat(container.dataset.viewWidth);
	const totalWidth = parseFloat(container.dataset.totalWidth);

	let scrollPosition;
	if (pageIndex === 0) {
		// First page - go to the beginning
		scrollPosition = 0;
	} else if (pageIndex === numPages - 1) {
		// Last page - go all the way to the end
		scrollPosition = totalWidth - containerWidth;
	} else {
		// Middle pages - calculate exact position
		scrollPosition =
			(pageIndex / (numPages - 1)) * (totalWidth - containerWidth);
	}

	// Scroll with animation
	container.scrollTo({
		left: scrollPosition,
		behavior: "smooth",
	});

	// Update dots immediately for better UX
	updateActiveDot(dotsContainer, pageIndex);

	// Update arrow states
	leftArrow.classList.toggle("disabled", pageIndex === 0);
	rightArrow.classList.toggle("disabled", pageIndex === numPages - 1);

	// Release scroll lock after animation completes
	setTimeout(() => {
		paginationContainer.dataset.scrolling = "false";
	}, 500);
}

/**
 * Updates which dot is active
 */
function updateActiveDot(dotsContainer, index) {
	// Update active state on dots
	dotsContainer.querySelectorAll(".dot").forEach((dot, idx) => {
		const isActive = idx === index;
		dot.classList.toggle("active", isActive);
		dot.setAttribute("aria-current", isActive ? "true" : "false");
	});
}

/**
 * Simple debounce function to limit scroll event processing
 */
function debounce(func, wait) {
	let timeout;
	return function executedFunction(...args) {
		const later = () => {
			clearTimeout(timeout);
			func(...args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
}
