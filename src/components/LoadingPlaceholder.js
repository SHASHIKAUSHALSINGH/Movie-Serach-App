import React from "react";
import "./LoadingPlaceholder.css";

const LoadingPlaceholder = () => {
  return (
    <div className="loading-container">
      <div className="loading-grid">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="loading-card">
            <div className="loading-poster skeleton"></div>
            <div className="loading-info">
              <div className="loading-title skeleton"></div>
              <div className="loading-year skeleton"></div>
              <div className="loading-type skeleton"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingPlaceholder;
