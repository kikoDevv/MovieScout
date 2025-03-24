export function searchModal() {
	const searchSection = document.querySelector(".searchSection");
	const searchModal = document.createElement("div");
	searchModal.classList.add("search-modal");
	searchSection.appendChild(searchModal);
    //---------listen for input from searchbar--------
    const searchInput = document.querySelector(".searchBar");
    searchInput.addEventListener("input", (e) =>{
        const searchValue = e.target.value.trim();
        console.log(searchValue);
    })
	//----------create search card-----------
	createSearchCard(searchModal, "/src/pics/11.jpeg", "The movie title");
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
