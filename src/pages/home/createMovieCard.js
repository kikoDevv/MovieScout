//------------function create movie card----------------
export function createMovieCard(img, name, rating, year, runtime, container) {
    const cardContainer = document.querySelector(container);
    const fallbackImage = "/MovieScout/pics/notFound.jpeg";
    const fallbackName = "Shitt, 404!";
    const fallback = "404!";
    const movieCardHTML = `
        <div class="movieCard">
            <img
                class="moviesImg"
                src="${img}"
                alt="movie image not found"
                onerror="this.onerror=null;this.src='${fallbackImage}';" />
            <div class="cardInfo">
                <h3 class="moviesName">${name || fallbackName}</h3>
                <div class="movieInfo">
                    <div class="rating">
                        <i class="fa-brands fa-imdb fa-1xl"></i>
                        <p class="ratingNumber">${rating || fallback}</p>
                    </div>
                    <div class="year">
                        <i class="fa-regular fa-calendar-plus"></i>
                        <p class="yearNumber">${year || fallback}</p>
                    </div>
                    <div class="runtime">
                        <i class="fa-regular fa-hourglass-half"></i>
                        <p class="runtimeNumber">${runtime || fallback} min</p>
                    </div>
                </div>
                <button class="buyBtn">+ whatch list</button>
            </div>
        </div>
    `;
	cardContainer.innerHTML += movieCardHTML;
}