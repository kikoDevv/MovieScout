export async function fetchSearch(value) {
	// Sanitize and optimize the search term
	const searchTerm = value.trim();

	if (searchTerm.length < 2) {
		return { results: [] }; // Return empty results for very short queries
	}

	// Prepare different search terms for better accuracy
	const exactSearchTerm = searchTerm;
	const fuzzySearchTerm = searchTerm.toLowerCase();

	// Use different search parameters with appropriate weights
	const searchUrl =
		`https://imdb236.p.rapidapi.com/imdb/search?` +
		`originalTitle=${encodeURIComponent(exactSearchTerm)}` +
		`&originalTitleAutocomplete=${encodeURIComponent(fuzzySearchTerm)}` +
		`&primaryTitle=${encodeURIComponent(exactSearchTerm)}` +
		`&primaryTitleAutocomplete=${encodeURIComponent(fuzzySearchTerm)}` +
		`&sortOrder=DESC` + // Show best matches first
		`&limit=10`; // Limit results for faster response

	const Key = "07807008b3msh7188004c6c5cd67p18ca7bjsnbc847e4ae696";

	try {
		const response = await fetch(searchUrl, {
			method: "GET",
			headers: {
				"x-rapidapi-host": "imdb236.p.rapidapi.com",
				"x-rapidapi-key": Key,
				"cache-control": "no-cache", // Ensure fresh results
			},
		});

		if (!response.ok) {
			throw new Error(`Response not ok: ${response.status}`);
		}

		const data = await response.json();

		// Post-process results to improve relevance
		if (data && data.results && data.results.length > 0) {
			// Sort results by relevance - exact matches first
			data.results.sort((a, b) => {
				const titleA = (a.primaryTitle || a.originalTitle || "").toLowerCase();
				const titleB = (b.primaryTitle || b.originalTitle || "").toLowerCase();

				// Exact match gets highest priority
				if (titleA === searchTerm.toLowerCase()) return -1;
				if (titleB === searchTerm.toLowerCase()) return 1;

				// Starts with search term gets next priority
				const aStartsWithTerm = titleA.startsWith(searchTerm.toLowerCase());
				const bStartsWithTerm = titleB.startsWith(searchTerm.toLowerCase());
				if (aStartsWithTerm && !bStartsWithTerm) return -1;
				if (!aStartsWithTerm && bStartsWithTerm) return 1;

				// Otherwise keep original order
				return 0;
			});
		}

		console.log("Search results:", data);
		return data;
	} catch (error) {
		console.log("Error in fetch-search:", error);
		return { results: [], error: error.message };
	}
}
