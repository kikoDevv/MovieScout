document.addEventListener("DOMContentLoaded", () => {
	const filterBtn = document.querySelector(".filterBtn");
	const filterMenu = document.querySelector(".filterMenu");
	const cardContainer = document.querySelector(".cardContainer");
	// Event listener for filter menu toggle
	filterBtn.addEventListener("click", () => {
		if (filterMenu.classList.value === "filterMenu") {
			filterMenu.classList.remove("filterMenu");
			filterBtn.classList.remove("fa-solid");
			filterBtn.classList.remove("fa-xmark");
			filterMenu.classList.add("hidden");
			filterBtn.textContent = "Filter movies";
		} else {
			filterMenu.classList.remove("hidden");
			filterMenu.classList.add("filterMenu");
			filterBtn.textContent = "";
			filterBtn.classList.add("fa-solid");
			filterBtn.classList.add("fa-xmark");
			filterBtn.classList.add("fa-2xl");
		}
	});

	// Codeblock for search bar
	const searchSection = document.querySelector(".searchSection");
	const initialTop = searchSection.offsetTop;

	window.addEventListener("scroll", () => {
		if (window.scrollY >= initialTop + 160) {
			searchSection.style.position = "fixed";
			searchSection.style.top = "30px";
		} else {
			searchSection.style.position = "absolute";
			searchSection.style.top = "45%";
			searchSection.style.minWidth = "40vw";
		}
	});
});
//------------movie api-----------------
fetchData();
//----------function to fetch data from api-------
async function fetchData() {
	const url = "https://imdb236.p.rapidapi.com/imdb/most-popular-movies";
	const options = {
		method: "GET",
		headers: {
			"x-rapidapi-key": "07807008b3msh7188004c6c5cd67p18ca7bjsnbc847e4ae696",
			"x-rapidapi-host": "imdb236.p.rapidapi.com",
		},
	};
	try {
		const response = await fetch(url, options);
		const data = await response.json();
		const topRatedMovies = data
			.sort((a, b) => b.averageRating - a.averageRating)
			.slice(0, 10);
		//---------------create movie card from api-----------
		console.log(data.length);
		console.log(data);
		topRatedMovies.forEach((movie) => {
			createMovieCard(
				movie.primaryImage,
				movie.title,
				movie.averageRating,
				movie.startYear,
				movie.runtimeMinutes
			);
		});
	} catch (error) {
		console.error(error);
	}
}

//------------function create movie card----------------
function createMovieCard(img, name, rating, year, runtime) {
	const cardContainer = document.querySelector(".cardContainer");
	const movieCardHTML = `
        <div class="movieCard">
            <img
                class="moviesImg"
                src="${img}"
                alt="movie image not found" />
            <div class="cardInfo">
                <h2 class="moviesName">${name}</h2>
                <div class="movieInfo">
                    <div class="rating">
                        <i class="fa-brands fa-imdb fa-1xl"></i>
						<p class="ratingNumber">${rating}</p>
                    </div>
                    <div class="year">
                        <i class="fa-regular fa-calendar-plus"></i>
						<p class="yearNumber">${year}</p>
                    </div>
                    <div class="runtime">
                         <i class="fa-regular fa-hourglass-half"></i>
						<p class="runtimeNumber">${runtime}M</p>
                    </div>
                </div>
                <button class="buyBtn">Buy ticket</button>
            </div>
        </div>
    `;
	cardContainer.innerHTML += movieCardHTML;
}
