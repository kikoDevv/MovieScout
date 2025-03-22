export function createPaginationDots() {
	// Immediate initialization attempt
	initPagination();

	// Also initialize on window load for fully rendered content
	window.addEventListener("load", () => {
		console.log("Window loaded, initializing pagination");
		initPagination();
	});

	// Re-initialize on resize
	window.addEventListener(
		"resize",
		debounce(() => {
			initPagination();
		}, 250)
	);

	// Safety timeout for delayed initialization
	setTimeout(() => {
		initPagination();
	}, 1000);

	// Secondary safety timeout
	setTimeout(() => {
		const containers = document.querySelectorAll(".cardContainer");
		containers.forEach((container) => {
			if (
				container.classList.contains("load") &&
				(!container.nextElementSibling ||
					!container.nextElementSibling.classList.contains(
						"pagination-container"
					))
			) {
				console.log(`Forcing pagination for ${container.id}`);
				setupPagination(container);
			}
		});
	}, 2000);

	// Set up mutation observer to detect when content is added
	setupContentObserver();
}

// Monitor DOM changes to detect when movie cards are added
function setupContentObserver() {
	const movieSection = document.querySelector(".moviesSection");
	if (!movieSection) return;

	const observer = new MutationObserver((mutations) => {
		let shouldInit = false;

		mutations.forEach((mutation) => {
			// If nodes were added and they're movie cards
			if (mutation.addedNodes.length > 0) {
				for (let i = 0; i < mutation.addedNodes.length; i++) {
					const node = mutation.addedNodes[i];
					if (node.classList && node.classList.contains("movieCard")) {
						shouldInit = true;
						break;
					}
				}
			}

			// If the 'load' class was added to a container
			if (
				mutation.type === "attributes" &&
				mutation.attributeName === "class" &&
				mutation.target.classList.contains("cardContainer") &&
				mutation.target.classList.contains("load")
			) {
				shouldInit = true;
			}
		});

		if (shouldInit) {
			console.log("Content changed, initializing pagination");
			// Short delay to ensure rendering is complete
			setTimeout(initPagination, 100);
		}
	});

	observer.observe(movieSection, {
		childList: true,
		subtree: true,
		attributes: true,
		attributeFilter: ["class"],
	});
}

// Export setupPagination to allow direct initialization for specific containers
export function setupPagination(container, retryCount = 0) {
	const maxRetries = 10;

	if (!container.classList.contains("load")) {
		if (retryCount < maxRetries) {
			const delay = Math.min(500 * Math.pow(1.5, retryCount), 5000);
			setTimeout(() => setupPagination(container, retryCount + 1), delay);
			console.log(
				`Pagination retry ${retryCount + 1} for ${container.id} in ${delay}ms`
			);
		} else {
			console.warn(
				`Failed to initialize pagination for ${container.id} after ${maxRetries} attempts`
			);
		}
		return;
	}

	const existingPagination = container.nextElementSibling;
	if (
		existingPagination &&
		(existingPagination.classList.contains("pagination-dots") ||
			existingPagination.classList.contains("pagination-container"))
	) {
		existingPagination.remove();
	}

	// Force a layout reflow to ensure accurate measurements
	void container.offsetWidth;

	// Use getBoundingClientRect for more accurate width measurement
	const containerRect = container.getBoundingClientRect();
	const containerWidth = containerRect.width || container.offsetWidth;
	const scrollWidth = container.scrollWidth;

	// Add some debug logging
	console.log(
		`Container ${container.id}: width=${containerWidth}, scroll=${scrollWidth}`
	);

	// Force pagination for mobile/small screens regardless of scroll width
	const viewportWidth = window.innerWidth;
	const forceOnMobile = viewportWidth < 768;

	// Skip pagination only if container is wider than content AND not on mobile
	if (scrollWidth <= containerWidth && !forceOnMobile) {
		console.log(`Skipping pagination for ${container.id} - no overflow`);
		return;
	}

	let cardWidth = 320;
	if (viewportWidth < 768) {
		cardWidth = 280;
	} else if (viewportWidth > 1440) {
		cardWidth = 360;
	}

	// Count actual cards instead of relying on childElementCount
	const cards = container.querySelectorAll(".movieCard");
	const totalCards = cards.length;

	if (totalCards === 0) {
		console.log(`No cards found in ${container.id}, skipping pagination`);
		return;
	}

	// Calculate card width from actual cards if possible
	if (cards.length > 0) {
		const sampleCard = cards[0];
		const sampleWidth = sampleCard.getBoundingClientRect().width;
		if (sampleWidth > 0) {
			cardWidth = sampleWidth;
		}
	}

	const visibleCards = Math.max(1, Math.floor(containerWidth / cardWidth));
	const numPages = Math.max(2, Math.ceil(totalCards / visibleCards));

	container.dataset.totalWidth = scrollWidth.toString();
	container.dataset.viewWidth = containerWidth.toString();
	container.dataset.numPages = numPages.toString();

	const paginationContainer = document.createElement("div");
	paginationContainer.classList.add("pagination-container");
	paginationContainer.setAttribute("aria-label", "Pagination controls");
	paginationContainer.dataset.containerId = container.id;

	paginationContainer.dataset.scrolling = "false";

	const leftArrow = document.createElement("div");
	leftArrow.classList.add("nav-arrow", "left-arrow", "disabled");
	leftArrow.innerHTML = '<i class="fas fa-chevron-left"></i>';
	leftArrow.setAttribute("role", "button");
	leftArrow.setAttribute("aria-label", "Previous page");
	leftArrow.setAttribute("tabindex", "0");
	paginationContainer.appendChild(leftArrow);

	const dotsContainer = document.createElement("div");
	dotsContainer.classList.add("pagination-dots");

	for (let i = 0; i < numPages; i++) {
		const dot = document.createElement("button");
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

	const dotFlowContainer = document.createElement("div");
	dotFlowContainer.classList.add("dot-flow-container");
	dotsContainer.appendChild(dotFlowContainer);

	paginationContainer.appendChild(dotsContainer);

	const rightArrow = document.createElement("div");
	rightArrow.classList.add("nav-arrow", "right-arrow");
	rightArrow.innerHTML = '<i class="fas fa-chevron-right"></i>';
	rightArrow.setAttribute("role", "button");
	rightArrow.setAttribute("aria-label", "Next page");
	rightArrow.setAttribute("tabindex", "0");
	paginationContainer.appendChild(rightArrow);

	container.insertAdjacentElement("afterend", paginationContainer);

	paginationContainer.addEventListener("click", (event) => {
		if (paginationContainer.dataset.scrolling === "true") {
			event.preventDefault();
			return;
		}

		const target = event.target;

		if (target.classList.contains("dot")) {
			const pageIndex = parseInt(target.dataset.page);
			scrollToPage(container, pageIndex);
			return;
		}

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

	//-----------Add keyboard navigation--------------------
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

	container.addEventListener(
		"scroll",
		debounce(() => {
			if (paginationContainer.dataset.scrolling === "true") return;

			const scrollPos = container.scrollLeft;
			const containerWidth = parseFloat(container.dataset.viewWidth);
			const scrollWidth = parseFloat(container.dataset.totalWidth);
			const scrollableWidth = scrollWidth - containerWidth;
			const numPages = parseInt(container.dataset.numPages);

			let activeDotIndex;

			if (scrollPos <= 5) {
				activeDotIndex = 0;
			} else if (scrollPos + containerWidth >= scrollWidth - 5) {
				activeDotIndex = numPages - 1;
			} else {
				const scrollPercentage = scrollPos / scrollableWidth;
				activeDotIndex = Math.min(
					Math.round(scrollPercentage * (numPages - 1)),
					numPages - 1
				);
			}

			updateActiveDot(dotsContainer, activeDotIndex);

			leftArrow.classList.toggle("disabled", activeDotIndex === 0);
			rightArrow.classList.toggle("disabled", activeDotIndex === numPages - 1);
		}, 100)
	);
}

function initPagination() {
	const movieContainers = document.querySelectorAll(".cardContainer");
	movieContainers.forEach((container) => {
		if (container.id && container.childElementCount > 0) {
			setupPagination(container);
		}
	});
}

function scrollToPage(container, pageIndex) {
	const paginationContainer = container.nextElementSibling;
	if (!paginationContainer) return;

	const dotsContainer = paginationContainer.querySelector(".pagination-dots");
	const leftArrow = paginationContainer.querySelector(".left-arrow");
	const rightArrow = paginationContainer.querySelector(".right-arrow");
	const numPages = parseInt(container.dataset.numPages);
	const dotFlowContainer = dotsContainer.querySelector(".dot-flow-container");

	if (pageIndex < 0 || pageIndex >= numPages) return;

	paginationContainer.dataset.scrolling = "true";

	const currentActiveDot = dotsContainer.querySelector(".dot.active");
	const currentActiveDotIndex = parseInt(currentActiveDot.dataset.page);

	const movingRight = pageIndex > currentActiveDotIndex;
	const movingLeft = pageIndex < currentActiveDotIndex;

	paginationContainer.classList.remove("move-right", "move-left");
	if (movingRight) paginationContainer.classList.add("move-right");
	if (movingLeft) paginationContainer.classList.add("move-left");

	currentActiveDot.classList.add("previous");

	paginationContainer.classList.add("transitioning");

	if (dotFlowContainer && Math.abs(pageIndex - currentActiveDotIndex) === 1) {
		const allDots = Array.from(dotsContainer.querySelectorAll(".dot"));
		const fromDot = allDots[currentActiveDotIndex];
		const toDot = allDots[pageIndex];

		if (fromDot && toDot) {
			const fromRect = fromDot.getBoundingClientRect();
			const toRect = toDot.getBoundingClientRect();
			const dotsContainerRect = dotsContainer.getBoundingClientRect();

			const left = fromRect.left - dotsContainerRect.left + fromRect.width / 2;
			const width = toRect.left - fromRect.left;

			dotFlowContainer.style.left = `${left}px`;
			dotFlowContainer.style.width = `${Math.abs(width)}px`;
			dotFlowContainer.style.transform = width < 0 ? "scaleX(-1)" : "scaleX(1)";

			setTimeout(() => {
				dotFlowContainer.classList.add("animate");
			}, 10);

			setTimeout(() => {
				dotFlowContainer.classList.remove("animate");
			}, 600);
		}
	}

	const containerWidth = parseFloat(container.dataset.viewWidth);
	const totalWidth = parseFloat(container.dataset.totalWidth);

	let scrollPosition;
	if (pageIndex === 0) {
		scrollPosition = 0;
	} else if (pageIndex === numPages - 1) {
		scrollPosition = totalWidth - containerWidth;
	} else {
		const scrollFactor = pageIndex / (numPages - 1);
		scrollPosition = scrollFactor * (totalWidth - containerWidth);
	}

	updateActiveDotWithAnimation(
		dotsContainer,
		pageIndex,
		movingRight,
		movingLeft
	);

	leftArrow.classList.toggle("disabled", pageIndex === 0);
	rightArrow.classList.toggle("disabled", pageIndex === numPages - 1);

	const currentPosition = container.scrollLeft;
	const distance = Math.abs(scrollPosition - currentPosition);

	const duration = Math.min(800, Math.max(500, distance * 1.5));

	container.style.scrollBehavior = "auto";

	const startTime = performance.now();

	function animate(currentTime) {
		const elapsedTime = currentTime - startTime;
		const progress = Math.min(elapsedTime / duration, 1);

		const eased = easeInOutCubic(progress);

		const currentPos =
			currentPosition + (scrollPosition - currentPosition) * eased;
		container.scrollLeft = currentPos;

		if (progress < 1) {
			requestAnimationFrame(animate);
		} else {
			container.style.scrollBehavior = "smooth";
			finishTransition();
		}
	}

	requestAnimationFrame(animate);

	const safetyTimeout = setTimeout(finishTransition, duration + 100);

	function finishTransition() {
		clearTimeout(safetyTimeout);

		dotsContainer.querySelectorAll(".dot").forEach((dot) => {
			dot.classList.remove("previous", "slide-left", "slide-right");
		});

		setTimeout(() => {
			paginationContainer.classList.remove(
				"transitioning",
				"move-left",
				"move-right"
			);
			paginationContainer.dataset.scrolling = "false";
		}, 150);
	}
}

function easeInOutCubic(t) {
	return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function updateActiveDotWithAnimation(
	dotsContainer,
	index,
	movingRight,
	movingLeft
) {
	const dots = dotsContainer.querySelectorAll(".dot");

	dots.forEach((dot) => {
		dot.classList.remove("slide-left", "slide-right");
	});

	dots.forEach((dot, idx) => {
		const isActive = idx === index;

		if (isActive) {
			if (movingRight) {
				dot.classList.add("slide-right");
			} else if (movingLeft) {
				dot.classList.add("slide-left");
			}

			dot.classList.add("active");
			dot.setAttribute("aria-current", "true");
		} else {
			dot.classList.remove("active");
			dot.setAttribute("aria-current", "false");
		}
	});
}
function updateActiveDot(dotsContainer, index) {
	dotsContainer.querySelectorAll(".dot").forEach((dot, idx) => {
		const isActive = idx === index;
		dot.classList.toggle("active", isActive);
		dot.setAttribute("aria-current", isActive ? "true" : "false");
	});
}
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
