import config from "../config/config.js";

export async function fetchSearch(value) {
	const searchTerm = value.trim();

	if (searchTerm.length < 2) {
		return { results: [] };
	}

	const searchUrl = config.getSearchUrl(searchTerm, 10);

	console.log("Search URL:", searchUrl);
	console.log("Search term:", searchTerm);

	try {
		const response = await fetch(searchUrl, {
			method: "GET",
			headers: config.getApiHeaders(),
		});

		console.log("Response status:", response.status);

		if (!response.ok) {
			console.error("HTTP Error:", response.status, response.statusText);
			throw new Error(
				`Response not ok: ${response.status} ${response.statusText}`
			);
		}

		const data = await response.json();
		console.log("Raw API response:", data);

		// Handle different possible API response structures
		let results = [];
		if (Array.isArray(data)) {
			results = data;
		} else if (data && data.results && Array.isArray(data.results)) {
			results = data.results;
		} else if (data && data.data && Array.isArray(data.data)) {
			results = data.data;
		}

		if (results && results.length > 0) {
			results.sort((a, b) => {
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

			const movies = results.filter((item) =>
				item.titleType?.toLowerCase().includes("movie")
			);
			const tvShows = results.filter(
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

				const remaining = results.filter(
					(item) => !mixedResults.includes(item)
				);
				results = [...mixedResults, ...remaining];
			}
		}

		// Return in expected format
		return { results: results };
	} catch (error) {
		console.error("Detailed fetch error:", error);
		return { results: [], error: error.message };
	}
}
