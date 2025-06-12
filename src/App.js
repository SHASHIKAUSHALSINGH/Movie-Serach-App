import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import MovieDetail from "./pages/MovieDetail";
import Favorites from "./pages/Favorites";
import ErrorBoundary from "./components/ErrorBoundary";
import "./App.css";

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <header className="app-header">
            <div className="header-content">
              <Link to="/" className="logo">
                <h1>🎬 Movie Search</h1>
              </Link>
              <nav className="nav-links">
                <Link to="/" className="nav-link">
                  🏠 Home
                </Link>
                <Link to="/favorites" className="nav-link">
                  ❤️ Favorites
                </Link>
              </nav>
            </div>
          </header>
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movie/:id" element={<MovieDetail />} />
              <Route path="/favorites" element={<Favorites />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
