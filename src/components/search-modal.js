import { fetchSearch } from "./fetch-search.js"; // Fix import path

export function searchModal() {
	const searchSection = document.querySelector(".searchSection");
	const searchModal = document.createElement("div");
	searchModal.classList.add("search-modal");
	searchSection.appendChild(searchModal);

	//---------listen for input from searchbar--------
	const searchInput = document.querySelector(".searchBar");

	searchInput.addEventListener("input", async (e) => {
		const searchValue = e.target.value.trim();
		searchModal.innerHTML = "";
		if (searchValue) {
			try {
				//----Show loading state
				const loadingCard = document.createElement("div");
				loadingCard.classList.add("search-card", "loading");
				loadingCard.textContent = "Searching...";
				searchModal.appendChild(loadingCard);

				//----Fetch search results
				const searchResults = await fetchSearch(searchValue);
				console.log("search result:ss", searchResults);
				//----Clear loading state
				searchModal.innerHTML = "";

				if (
					searchResults &&
					searchResults.results &&
					searchResults.results.length > 0
				) {
					//----Limit to first 5 results for better UX
					const limitedResults = searchResults.results.slice(0, 5);

					limitedResults.forEach((movie) => {
						//------image-----------
						const imageUrl = movie.primaryImage || "/src/pics/notFound.jpeg";

						createSearchCard(
							searchModal,
							imageUrl,
							movie.primaryTitle || movie.originalTitle || "Shit, 404!"
						);
					});
				} else {
					createSearchCard(
						searchModal,
						"/src/pics/notFound.jpeg",
						"No results found"
					);
				}
			} catch (error) {
				console.error("Error processing search:", error);
				searchModal.innerHTML = "";
				createSearchCard(
					searchModal,
					"/src/pics/notFound.jpeg",
					"Error searching movies"
				);
			}
		}
	});
}

//---------func to create search card--------
function createSearchCard(parentElement, img, title) {
	const searchCard = document.createElement("div");
	searchCard.classList.add("search-card");
	parentElement.appendChild(searchCard);
	const searchImg = document.createElement("img");
	searchImg.classList.add("search-img");
	searchImg.src = img;
	searchImg.alt = "Movie image not found";
	searchCard.appendChild(searchImg);
	const searchInfoCont = document.createElement("div");
	searchInfoCont.classList.add("search-info-container");
	searchCard.appendChild(searchInfoCont);
	const searchedTitle = document.createElement("p");
	searchedTitle.classList.add("searched-title");
	searchedTitle.textContent = title;
	searchInfoCont.appendChild(searchedTitle);
}
