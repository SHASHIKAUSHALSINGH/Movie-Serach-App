import React, { useState, useEffect, useCallback } from "react";
import SearchBar from "../components/SearchBar";
import MovieGrid from "../components/MovieGrid";
import LoadingPlaceholder from "../components/LoadingPlaceholder";
import { searchMovies, getFeaturedMovies } from "../services/movieService";
import "./Home.css";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [showingFeatured, setShowingFeatured] = useState(true);

  const handleSearch = useCallback(
    async (searchQuery, pageNum = 1, append = false) => {
      if (!searchQuery.trim()) {
        setMovies([]);
        setError("");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const data = await searchMovies(searchQuery, pageNum);

        if (data.Response === "True") {
          setMovies((prevMovies) => {
            const newMovies = append
              ? [...prevMovies, ...data.Search]
              : data.Search;
            return newMovies;
          });
          setTotalResults(parseInt(data.totalResults));
          setHasMore(data.Search.length === 10); // OMDB returns 10 results per page
        } else {
          setMovies([]);
          setError(data.Error || "No movies found");
          setHasMore(false);
        }
      } catch (err) {
        setError("Failed to fetch movies. Please try again.");
        setMovies([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [] // Remove movies dependency to prevent infinite re-renders
  );
  const loadFeaturedMovies = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const featuredMovies = await getFeaturedMovies();
      if (featuredMovies && featuredMovies.length > 0) {
        setMovies(featuredMovies);
        setHasMore(false);
        setShowingFeatured(true);
      } else {
        // Fallback to search if featured movies fail
        setShowingFeatured(false);
        const data = await searchMovies("Marvel", 1);
        if (data.Response === "True") {
          setMovies(data.Search);
          setHasMore(data.Search.length === 10);
        }
      }
    } catch (error) {
      console.error("Error loading featured movies:", error);
      setError("Failed to load movies");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearchQuery = useCallback(
    async (searchQuery) => {
      setQuery(searchQuery);
      setPage(1);
      setError("");

      if (searchQuery.trim()) {
        setShowingFeatured(false);
        handleSearch(searchQuery, 1, false);
      } else {
        // If search is empty, reload featured movies
        await loadFeaturedMovies();
      }
    },
    [handleSearch, loadFeaturedMovies]
  );

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      handleSearch(query, nextPage, true);
    }
  }, [page, query, handleSearch, loading, hasMore]);
  useEffect(() => {
    // Load featured movies on initial page load
    loadFeaturedMovies();
  }, [loadFeaturedMovies]);
  return (
    <div className="home">
      <SearchBar onSearch={handleSearchQuery} />

      {showingFeatured && !loading && movies.length > 0 && (
        <div className="section-header">
          <h2>🎬 Featured Movies</h2>
          <p>Handpicked popular and latest movies just for you</p>
        </div>
      )}

      {!showingFeatured && query && !loading && movies.length > 0 && (
        <div className="section-header">
          <h2>🔍 Search Results for "{query}"</h2>
          <p>Found movies matching your search</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {loading && movies.length === 0 ? (
        <LoadingPlaceholder />
      ) : (
        <MovieGrid
          movies={movies}
          onLoadMore={handleLoadMore}
          hasMore={!showingFeatured && hasMore}
          loading={loading}
        />
      )}
    </div>
  );
};

export default Home;
