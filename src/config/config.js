class Config {
	constructor() {
		// Load environment variables or use fallbacks for development
		this.RAPIDAPI_KEY = this.getEnvVar("RAPIDAPI_KEY");
		this.RAPIDAPI_HOST = this.getEnvVar(
			"RAPIDAPI_HOST",
			"imdb236.p.rapidapi.com"
		);
		this.IMDB_BASE_URL = this.getEnvVar(
			"IMDB_BASE_URL",
			"https://imdb236.p.rapidapi.com/api/imdb"
		);
		this.TMDB_API_KEY = this.getEnvVar("TMDB_API_KEY");
		this.TMDB_BASE_URL = this.getEnvVar(
			"TMDB_BASE_URL",
			"https://api.themoviedb.org/3"
		);

		// Validate required keys
		this.validateConfig();
	}

	getEnvVar(key, fallback = null) {
		// In a browser environment, you might need to inject these via build process
		// For now, we'll use a simple approach
		if (typeof process !== "undefined" && process.env) {
			return process.env[key] || fallback;
		}

		// Fallback for browser - you should replace these with your actual keys
		// and use a build process to inject them securely
		const envVars = {
			RAPIDAPI_KEY: "07807008b3msh7188004c6c5cd67p18ca7bjsnbc847e4ae696",
			RAPIDAPI_HOST: "imdb236.p.rapidapi.com",
			IMDB_BASE_URL: "https://imdb236.p.rapidapi.com/api/imdb",
			TMDB_API_KEY: "7ae0a5d36394abcbfe893ebb3cd504f9",
			TMDB_BASE_URL: "https://api.themoviedb.org/3",
		};

		return envVars[key] || fallback;
	}

	validateConfig() {
		if (!this.RAPIDAPI_KEY) {
			console.error("RAPIDAPI_KEY is required but not found in environment");
		}
		if (!this.TMDB_API_KEY) {
			console.error("TMDB_API_KEY is required but not found in environment");
		}
	}

	// API URL builders
	getMoviesUrl() {
		return `${this.IMDB_BASE_URL}/most-popular-movies`;
	}

	getTvShowsUrl() {
		return `${this.IMDB_BASE_URL}/most-popular-tv`;
	}

	getSearchUrl(query, limit = 10) {
		return `${this.IMDB_BASE_URL}/search?query=${encodeURIComponent(
			query
		)}&limit=${limit}`;
	}

	getTmdbSearchUrl(query) {
		return `${this.TMDB_BASE_URL}/search/movie?api_key=${
			this.TMDB_API_KEY
		}&query=${encodeURIComponent(query)}`;
	}

	getTmdbVideosUrl(movieId) {
		return `${this.TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${this.TMDB_API_KEY}`;
	}

	// Request headers
	getApiHeaders() {
		return {
			"x-rapidapi-host": this.RAPIDAPI_HOST,
			"x-rapidapi-key": this.RAPIDAPI_KEY,
			"cache-control": "no-cache",
		};
	}
}

export default new Config();
