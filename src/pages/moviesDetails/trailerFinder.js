findTrailer("sonic");

function findTrailer(movieTitle) {
	document.addEventListener("DOMContentLoaded", async () => {
		// TMDb API key
		const tmdbKey = "7ae0a5d36394abcbfe893ebb3cd504f9";
		try {
			// Search for the movie to get its id
			const searchURL = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}&query=${encodeURIComponent(
				movieTitle
			)}`;
			const searchResponse = await fetch(searchURL);
			const searchData = await searchResponse.json();
			if (!(searchData.results && searchData.results.length > 0)) {
				return console.error("No movie found.");
			}
			const movieId = searchData.results[0].id;

			// Get movie videos using movie id
			const videoURL = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${tmdbKey}`;
			const videoResponse = await fetch(videoURL);
			const videoData = await videoResponse.json();
			if (videoData.results && videoData.results.length > 0) {
				// Filter for YouTube trailer
				const trailer = videoData.results.find(
					(video) => video.site === "YouTube" && video.type === "Trailer"
				);
				if (trailer) {
					document.getElementById("trailerFrame").src =
						"https://www.youtube.com/embed/" + trailer.key;
					return;
				}
			}
			console.error("No trailer found.");
		} catch (error) {
			console.error("Error fetching trailer:", error);
		}
	});
}
