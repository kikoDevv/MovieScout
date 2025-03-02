findTrailer("batman");
function findTrailer(movieTitle) {
	document.addEventListener("DOMContentLoaded", () => {
		// Use the provided video ID to prevent hitting the TMDb API limit
		const videoId = "CRlOe5DxVrg";
		document.getElementById("trailerFrame").src =
			"https://www.youtube.com/embed/" + videoId;
	});
};
