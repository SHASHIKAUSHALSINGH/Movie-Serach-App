import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMovieDetails } from "../services/movieService";
import { toggleFavorite, isFavorite } from "../services/favoriteService";
import LoadingPlaceholder from "../components/LoadingPlaceholder";
import "./MovieDetail.css";

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getMovieDetails(id);

        if (data.Response === "True") {
          setMovie(data);
          setFavorite(isFavorite(id));
        } else {
          setError(data.Error || "Movie not found");
        }
      } catch (err) {
        setError("Failed to fetch movie details");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const handleToggleFavorite = () => {
    toggleFavorite(movie);
    setFavorite(!favorite);
  };

  if (loading) return <LoadingPlaceholder />;
  if (error)
    return (
      <div className="error-message">
        <p>{error}</p>
      </div>
    );
  if (!movie) return null;

  return (
    <div className="movie-detail">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="movie-detail-content">
        <div className="movie-poster">
          <img
            src={
              movie.Poster !== "N/A" ? movie.Poster : "/placeholder-movie.png"
            }
            alt={movie.Title}
            onError={(e) => {
              e.target.src = "/placeholder-movie.png";
            }}
          />
          <button
            className={`favorite-btn ${favorite ? "favorited" : ""}`}
            onClick={handleToggleFavorite}
          >
            {favorite ? "❤️" : "🤍"}{" "}
            {favorite ? "Remove from Favorites" : "Add to Favorites"}
          </button>
        </div>

        <div className="movie-info">
          <h1>{movie.Title}</h1>
          <div className="movie-meta">
            <span className="year">{movie.Year}</span>
            <span className="rating">{movie.Rated}</span>
            <span className="runtime">{movie.Runtime}</span>
          </div>

          <div className="movie-genres">
            {movie.Genre.split(", ").map((genre) => (
              <span key={genre} className="genre-tag">
                {genre}
              </span>
            ))}
          </div>

          <div className="movie-plot">
            <h3>Plot</h3>
            <p>{movie.Plot}</p>
          </div>

          <div className="movie-details">
            <div className="detail-item">
              <strong>Director:</strong> <span>{movie.Director}</span>
            </div>
            <div className="detail-item">
              <strong>Actors:</strong> <span>{movie.Actors}</span>
            </div>
            <div className="detail-item">
              <strong>Language:</strong> <span>{movie.Language}</span>
            </div>
            <div className="detail-item">
              <strong>Country:</strong> <span>{movie.Country}</span>
            </div>
            {movie.imdbRating !== "N/A" && (
              <div className="detail-item">
                <strong>IMDB Rating:</strong> <span>{movie.imdbRating}/10</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
