const apiKey = "07807008b3msh7188004c6c5cd67p18ca7bjsnbc847e4ae696";
const rapidApiHost = "imdb236.p.rapidapi.com";

// Function to search for movies
async function searchMovies(query) {
	const url = `https://${rapidApiHost}/imdb/autocomplete?query=${encodeURIComponent(
		query
	)}`;
	const options = {
		method: "GET",
		headers: {
			Accept: "application/json",
			"x-rapidapi-key": apiKey,
			"x-rapidapi-host": rapidApiHost,
		},
	};

	try {
		const response = await fetch(url, options);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error searching movies:", error);
		throw error;
	}
}

// Function to get movie details including image/poster
async function getMovieDetails(movieId) {
	const url = `https://${rapidApiHost}/imdb/title/${movieId}`;

	const options = {
		method: "GET",
		headers: {
			Accept: "application/json",
			"x-rapidapi-key": apiKey,
			"x-rapidapi-host": rapidApiHost,
		},
	};

	try {
		const response = await fetch(url, options);
		const data = await response.json();
		return data;
		// The movie poster URL is typically available in data.image or data.poster
		// Return the entire data object so you can extract what you need
	} catch (error) {
		console.error("Error fetching movie details:", error);
		throw error;
	}
}

// Example usage:
// 1. First search for a movie
// searchMovies("breaking bad").then(results => {
//   if (results && results.length > 0) {
//     // 2. Get the ID of the first result
//     const movieId = results[0].id;
//     // 3. Fetch details including poster
//     return getMovieDetails(movieId);
//   }
// }).then(movieDetails => {
//   // 4. Access the poster image URL (adjust the property path based on actual API response)
//   const posterUrl = movieDetails.image;
//   console.log("Movie poster URL:", posterUrl);
// }).catch(error => {
//   console.error("Error:", error);
// });

// Export functions for use in other components
export { searchMovies, getMovieDetails };
