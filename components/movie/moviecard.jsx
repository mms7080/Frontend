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
            {/* <br /> <br />개봉일 <span>{movie.releaseDate}</span> */}
          </p>
        </div>
        {movie.label && (
          <span className={`label ${
            movie.label == "MEGA ONLY" ? "purple" :
            movie.label == "Dolby" ? "gray" : "none"
          }`}>{movie.label}</span>
        )}
        {movie.rate && (
          <span className={`rate ${
            movie.rate == "ALL" ? "green" :
            movie.rate == "12" ? "yellow" :
            movie.rate == "15" ? "orange" :
            movie.rate == "19" ? "red" : "none"
          }`}>{movie.rate}</span>
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