import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toggleFavorite, isFavorite } from "../services/favoriteService";
import "./MovieCard.css";

const MovieCard = ({ movie, onFavoriteChange }) => {
  const navigate = useNavigate();
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    setFavorite(isFavorite(movie.imdbID));
  }, [movie.imdbID]);

  const handleCardClick = () => {
    navigate(`/movie/${movie.imdbID}`);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(movie);
    const newFavoriteState = isFavorite(movie.imdbID);
    setFavorite(newFavoriteState);

    // Notify parent component if callback provided
    if (onFavoriteChange) {
      onFavoriteChange(movie.imdbID, newFavoriteState);
    }
  };

  return (
    <div className="movie-card" onClick={handleCardClick}>
      <div className="movie-poster-container">
        <img
          src={movie.Poster !== "N/A" ? movie.Poster : "/placeholder-movie.png"}
          alt={movie.Title}
          className="movie-poster"
          onError={(e) => {
            e.target.src = "/placeholder-movie.png";
          }}
        />
        <button
          className={`favorite-icon ${favorite ? "favorited" : ""}`}
          onClick={handleFavoriteClick}
        >
          {favorite ? "❤️" : "🤍"}
        </button>
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{movie.Title}</h3>
        <p className="movie-year">{movie.Year}</p>
        <p className="movie-type">{movie.Type}</p>
      </div>
    </div>
  );
};

export default MovieCard;
