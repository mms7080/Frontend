import React from 'react';
import './moviecard.css';

const MovieCard = ({ movie, onBooking }) => {
  return (
    <div className="movie-card">
      <span className="rank">{movie.rank}</span>
      <div className="poster">
        <img src={movie.image} alt={movie.title} />
        <div className="overlay">
          <p>
            {movie.title} <br /> <br />
            {movie.description}<br /> <br />
            관람평 <span className="score">{movie.score}</span>
          </p>
        </div>
        {movie.label && (
          <span className={`label ${movie.label.type}`}>{movie.label.text}</span>
        )}
        {movie.rate && (
          <span className={`rate ${movie.rate.type}`}>{movie.rate.text}</span>
        )}
      </div>
      <div className="info">
        <div className="likes">❤️ {movie.likeNumber}</div>
        <button onClick={() => onBooking(movie.id)}>예매</button>
      </div>
    </div>
  );
};

export default MovieCard;