const FAVORITES_KEY = "movieAppFavorites";

export const getFavorites = () => {
  try {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error("Error getting favorites from localStorage:", error);
    return [];
  }
};

export const saveFavorites = (favorites) => {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error("Error saving favorites to localStorage:", error);
  }
};

export const toggleFavorite = (movie) => {
  const favorites = getFavorites();
  const existingIndex = favorites.findIndex(
    (fav) => fav.imdbID === movie.imdbID
  );

  if (existingIndex > -1) {
    // Remove from favorites
    favorites.splice(existingIndex, 1);
  } else {
    // Add to favorites
    favorites.push({
      imdbID: movie.imdbID,
      Title: movie.Title,
      Year: movie.Year,
      Poster: movie.Poster,
      Type: movie.Type,
    });
  }

  saveFavorites(favorites);
  return favorites;
};

export const isFavorite = (imdbId) => {
  const favorites = getFavorites();
  return favorites.some((fav) => fav.imdbID === imdbId);
};

export const removeFavorite = (imdbId) => {
  const favorites = getFavorites();
  const updatedFavorites = favorites.filter((fav) => fav.imdbID !== imdbId);
  saveFavorites(updatedFavorites);
  return updatedFavorites;
};
