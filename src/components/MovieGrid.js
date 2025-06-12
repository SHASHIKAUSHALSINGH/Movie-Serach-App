import React, { useEffect, useRef, useCallback, useState } from "react";
import MovieCard from "./MovieCard";
import LoadingPlaceholder from "./LoadingPlaceholder";
import "./MovieGrid.css";

const MovieGrid = ({ movies, onLoadMore, hasMore, loading }) => {
  const observer = useRef();
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  const lastMovieElementRef = useCallback(
    (node) => {
      if (loading || isLoadingMore || !hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (
            entries[0].isIntersecting &&
            hasMore &&
            !loading &&
            !isLoadingMore
          ) {
            setIsLoadingMore(true);
            onLoadMore();
            // Reset loading state after a delay to prevent rapid firing
            setTimeout(() => setIsLoadingMore(false), 2000);
          }
        },
        {
          rootMargin: "200px", // Start loading earlier to prevent flickering
          threshold: 0.1,
        }
      );

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, onLoadMore, isLoadingMore]
  );

  if (!movies || movies.length === 0) {
    return (
      <div className="no-results">
        <p>No movies found. Try searching for something else!</p>
      </div>
    );
  }

  return (
    <div className="movie-grid-container">
      <div className="movie-grid">
        {movies.map((movie, index) => {
          if (movies.length === index + 1) {
            return (
              <div ref={lastMovieElementRef} key={movie.imdbID}>
                <MovieCard movie={movie} />
              </div>
            );
          } else {
            return <MovieCard key={movie.imdbID} movie={movie} />;
          }
        })}
      </div>{" "}
      {(loading || isLoadingMore) && (
        <div className="loading-more">
          <p>🎬 Loading more movies...</p>
        </div>
      )}
      {!hasMore && movies.length > 0 && (
        <div className="end-of-results">
          <p>🎬 You've reached the end of the results!</p>
        </div>
      )}
    </div>
  );
};

export default MovieGrid;
