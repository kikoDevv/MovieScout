export async function findTrailer(movieTitle) {
	if (!movieTitle) return;

	const apiKey = "7ae0a5d36394abcbfe893ebb3cd504f9";
	const trailerFrame = document.getElementById("trailerFrame");

	try {
		const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
			movieTitle
		)}`;
		const searchResponse = await fetch(searchUrl);
		const searchData = await searchResponse.json();

		if (searchData.results && searchData.results.length > 0) {
			const movieId = searchData.results[0].id;

			const videosUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`;
			const videosResponse = await fetch(videosUrl);
			const videosData = await videosResponse.json();

			let videoId = null;
			if (videosData.results && videosData.results.length > 0) {
				const trailers = videosData.results.filter(
					(video) =>
						video.site === "YouTube" &&
						(video.type === "Trailer" ||
							video.name.toLowerCase().includes("trailer"))
				);

				if (trailers.length > 0) {
					videoId = trailers[0].key;
				} else if (videosData.results[0].site === "YouTube") {
					videoId = videosData.results[0].key;
				}
			}

			if (trailerFrame && videoId) {
				trailerFrame.src = `https://www.youtube.com/embed/${videoId}`;
			} else {
				defaultTrailer(trailerFrame);
			}
		} else {
			defaultTrailer(trailerFrame);
		}
	} catch (error) {
		console.error("Error fetching trailer:", error);
		defaultTrailer(trailerFrame);
	}
}

function defaultTrailer(trailerFrame) {
	if (trailerFrame) {
		trailerFrame.src = "https://www.youtube.com/embed/CRlOe5DxVrg";
	}
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", () => {
		if (window.location.pathname.includes("movieDetailsModal.html")) {
			findTrailer("batman");
		}
	});
} else {
	if (window.location.pathname.includes("movieDetailsModal.html")) {
		findTrailer("batman");
	}
}
