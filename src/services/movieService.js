// Get API key and base URL from environment variables
const API_KEY = process.env.REACT_APP_API_KEY || "f6e100d7"; // Fallback for development
const BASE_URL = process.env.REACT_APP_BASE_URL || "http://www.omdbapi.com";

// Log warning if environment variables are not set
if (!process.env.REACT_APP_API_KEY) {
  console.warn("OMDB API key not found in environment variables. Using fallback key.");
}

export const searchMovies = async (query, page = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(
        query
      )}&page=${page}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error searching movies:", error);
    throw error;
  }
};

// Get featured/latest movies by fetching popular movie IDs
export const getFeaturedMovies = async () => {
  try {
    // Handpicked popular and recent movie IDs for featured section
    const featuredMovieIds = [
      "tt4154796", // Avengers: Endgame
      "tt0848228", // The Avengers
      "tt4154756", // Avengers: Infinity War
      "tt0371746", // Iron Man
      "tt0478970", // Ant-Man
      "tt3896198", // Guardians of the Galaxy Vol. 2
      "tt2015381", // Guardians of the Galaxy
      "tt0468569", // The Dark Knight
      "tt1375666", // Inception
      "tt0109830", // Forrest Gump
      "tt0111161", // The Shawshank Redemption
      "tt0137523", // Fight Club
    ];

    const moviePromises = featuredMovieIds.map((id) => getMovieDetails(id));
    const movies = await Promise.all(moviePromises);

    // Filter out any failed requests and format for grid
    const validMovies = movies
      .filter((movie) => movie && movie.Response === "True")
      .map((movie) => ({
        imdbID: movie.imdbID,
        Title: movie.Title,
        Year: movie.Year,
        Type: movie.Type,
        Poster: movie.Poster,
      }));

    return validMovies;
  } catch (error) {
    console.error("Error fetching featured movies:", error);
    return [];
  }
};

export const getMovieDetails = async (imdbId) => {
  try {
    const response = await fetch(
      `${BASE_URL}?apikey=${API_KEY}&i=${imdbId}&plot=full`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};
