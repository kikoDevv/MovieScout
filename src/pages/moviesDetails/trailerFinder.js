export async function findTrailer(movieTitle) {
	if (!movieTitle) return;

	const apiKey = "7ae0a5d36394abcbfe893ebb3cd504f9";
	const trailerFrame = document.getElementById("trailerFrame");

	if (trailerFrame) {
		//-------Show loading state--------
		trailerFrame.src = "";
		trailerFrame.setAttribute(
			"srcdoc",
			'<div style="display:flex;justify-content:center;align-items:center;height:100%;color:white;font-family:sans-serif;">Loading trailer...</div>'
		);
	}

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
				const officialTrailers = videosData.results.filter(
					(video) =>
						video.site === "YouTube" &&
						video.type === "Trailer" &&
						video.official === true
				);

				const anyTrailers = videosData.results.filter(
					(video) =>
						video.site === "YouTube" &&
						(video.type === "Trailer" ||
							video.name.toLowerCase().includes("trailer"))
				);

				const teasers = videosData.results.filter(
					(video) =>
						video.site === "YouTube" &&
						(video.type === "Teaser" ||
							video.name.toLowerCase().includes("teaser"))
				);

				if (officialTrailers.length > 0) {
					videoId = officialTrailers[0].key;
				} else if (anyTrailers.length > 0) {
					videoId = anyTrailers[0].key;
				} else if (teasers.length > 0) {
					videoId = teasers[0].key;
				} else if (videosData.results[0].site === "YouTube") {
					videoId = videosData.results[0].key;
				}
			}

			if (trailerFrame && videoId) {
				trailerFrame.removeAttribute("srcdoc");
				trailerFrame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
			} else {
				defaultTrailer(trailerFrame, movieTitle);
			}
		} else {
			defaultTrailer(trailerFrame, movieTitle);
		}
	} catch (error) {
		console.error("Error fetching trailer:", error);
		defaultTrailer(trailerFrame, movieTitle);
	}
}

function defaultTrailer(trailerFrame, movieTitle) {
	if (trailerFrame) {
		//--------to creating a direct search to YouTube as fallback--------
		const searchQuery = encodeURIComponent(movieTitle + " official trailer");
		trailerFrame.setAttribute(
			"srcdoc",
			`
			<div style="display:flex;flex-direction:column;justify-content:center;align-items:center;height:100%;color:white;font-family:sans-serif;text-align:center;padding:20px;">
				<p>No official trailer found for "${movieTitle}"</p>
				<a href="https://www.youtube.com/results?search_query=${searchQuery}" target="_blank" style="color:#ff416c;margin-top:10px;">Search on YouTube</a>
			</div>
		`
		);
	}
}

function getMovieTitleFromURL() {
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get("title") || "No title provided";
}

function initializeTrailer() {
	if (window.location.pathname.includes("movieDetailsModal.html")) {
		const movieTitle = getMovieTitleFromURL();
		findTrailer(movieTitle);
	}
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initializeTrailer);
} else {
	initializeTrailer();
}
