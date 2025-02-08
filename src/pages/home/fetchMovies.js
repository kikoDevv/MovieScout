import { createMovieCard } from "./createMovieCard.js";
//----------function to fetch data from api-------
export async function fetchData() {
	const urlMoves = "https://imdb236.p.rapidapi.com/imdb/most-popular-movies";
	const urlTvShows = "https://imdb236.p.rapidapi.com/imdb/most-popular-tv";
	const options = {
		method: "GET",
		headers: {
			"x-rapidapi-key": "07807008b3msh7188004c6c5cd67p18ca7bjsnbc847e4ae696",
			"x-rapidapi-host": "imdb236.p.rapidapi.com",
		},
	};
	try {
		//---------------get top movies--------------
		const response = await fetch(urlMoves, options);
		const data = await response.json();
		const topRatedMovies = data
			.sort((a, b) => b.averageRating - a.averageRating)
			.slice(0, 30);
		//---------------create movie card from api for top ten-----------
		topRatedMovies.forEach((movie) => {
			createMovieCard(
				movie.primaryImage,
				movie.originalTitle,
				movie.averageRating,
				movie.startYear,
				movie.runtimeMinutes,
				"#topTen"
			);
		});
		//---------get top tv shows----------------
		const responseTvShow = await fetch(urlTvShows, options);
		const tvShowData = await responseTvShow.json();
		const topTvShows = tvShowData
			.sort((a, b) => b.averageRating - a.averageRating)
			.slice(0, 30);
		//--------------generate tv shows card----------------
		topTvShows.forEach((tvShow) => {
			createMovieCard(
				tvShow.primaryImage,
				tvShow.originalTitle,
				tvShow.averageRating,
				tvShow.startYear,
				tvShow.runtimeMinutes,
				"#topTvShows"
			);
		});
		//-----------get new release------------------
		const newReleased = data
			.sort((a, b) => b.startYear - a.startYear)
			.slice(0, 30);
		newReleased.forEach((newR) => {
			createMovieCard(
				newR.primaryImage,
				newR.originalTitle,
				newR.averageRating,
				newR.startYear,
				newR.runtime,
				"#newReleased"
			);
		});
	} catch (error) {
		console.error(error);
	}
}