export async function fetchSearch(value) {
	const searchTerm = value.trim();

	if (searchTerm.length < 2) {
		return { results: [] };
	}

	const exactSearchTerm = searchTerm;
	const fuzzySearchTerm = searchTerm.toLowerCase();

	const searchUrl =
		`https://imdb236.p.rapidapi.com/imdb/search?` +
		`originalTitle=${encodeURIComponent(exactSearchTerm)}` +
		`&originalTitleAutocomplete=${encodeURIComponent(fuzzySearchTerm)}` +
		`&primaryTitle=${encodeURIComponent(exactSearchTerm)}` +
		`&primaryTitleAutocomplete=${encodeURIComponent(fuzzySearchTerm)}` +
		`&titleType=movie,tvSeries,tvMiniSeries,tvSpecial` +
		`&sortOrder=DESC` +
		`&limit=30`;

	const Key = "07807008b3msh7188004c6c5cd67p18ca7bjsnbc847e4ae696";

	try {
		const response = await fetch(searchUrl, {
			method: "GET",
			headers: {
				"x-rapidapi-host": "imdb236.p.rapidapi.com",
				"x-rapidapi-key": Key,
				"cache-control": "no-cache",
			},
		});

		if (!response.ok) {
			throw new Error(`Response not ok: ${response.status}`);
		}

		const data = await response.json();

		if (data && data.results && data.results.length > 0) {
			data.results.sort((a, b) => {
				const titleA = (a.primaryTitle || a.originalTitle || "").toLowerCase();
				const titleB = (b.primaryTitle || b.originalTitle || "").toLowerCase();

				if (titleA === searchTerm.toLowerCase()) return -1;
				if (titleB === searchTerm.toLowerCase()) return 1;

				const aStartsWithTerm = titleA.startsWith(searchTerm.toLowerCase());
				const bStartsWithTerm = titleB.startsWith(searchTerm.toLowerCase());
				if (aStartsWithTerm && !bStartsWithTerm) return -1;
				if (!aStartsWithTerm && bStartsWithTerm) return 1;

				if (
					a.ratingsSummary?.aggregateRating &&
					b.ratingsSummary?.aggregateRating
				) {
					return (
						b.ratingsSummary.aggregateRating - a.ratingsSummary.aggregateRating
					);
				}

				return 0;
			});

			const movies = data.results.filter((item) =>
				item.titleType?.toLowerCase().includes("movie")
			);
			const tvShows = data.results.filter(
				(item) =>
					item.titleType?.toLowerCase().includes("tv") ||
					item.titleType?.toLowerCase().includes("series")
			);

			if (movies.length > 0 && tvShows.length > 0) {
				const mixedResults = [];
				const maxPerType = 5;

				for (
					let i = 0;
					i <
					Math.max(
						Math.min(movies.length, maxPerType),
						Math.min(tvShows.length, maxPerType)
					);
					i++
				) {
					if (i < movies.length) mixedResults.push(movies[i]);
					if (i < tvShows.length) mixedResults.push(tvShows[i]);
				}

				const remaining = data.results.filter(
					(item) => !mixedResults.includes(item)
				);
				data.results = [...mixedResults, ...remaining];
			}
		}

		console.log("Search results:", data);
		return data;
	} catch (error) {
		console.log("Error in fetch-search:", error);
		return { results: [], error: error.message };
	}
}
