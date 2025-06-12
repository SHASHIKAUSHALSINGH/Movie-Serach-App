import React, { useState, useEffect } from "react";
import MovieGrid from "../components/MovieGrid";
import { getFavorites, removeFavorite } from "../services/favoriteService";
import "./Favorites.css";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    setLoading(true);
    try {
      const favoriteMovies = getFavorites();
      setFavorites(favoriteMovies);
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = (imdbId) => {
    removeFavorite(imdbId);
    loadFavorites(); // Reload favorites after removal
  };

  if (loading) {
    return (
      <div className="favorites-loading">
        <p>Loading your favorite movies...</p>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h1>❤️ My Favorite Movies</h1>
        <p>Your personally curated collection of amazing movies</p>
        {favorites.length > 0 && (
          <p className="favorites-count">
            You have {favorites.length} favorite movie
            {favorites.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="no-favorites">
          <div className="no-favorites-content">
            <h2>🎬 No Favorites Yet</h2>
            <p>
              Start adding movies to your favorites by clicking the heart icon
              on any movie card!
            </p>
            <p>
              Discover some amazing movies by searching or browsing our featured
              selection.
            </p>
          </div>
        </div>
      ) : (
        <div className="favorites-grid-container">
          <MovieGrid
            movies={favorites}
            onLoadMore={() => {}} // No load more for favorites
            hasMore={false}
            loading={false}
          />
        </div>
      )}
    </div>
  );
};

export default Favorites;
