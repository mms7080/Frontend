import React from 'react';
import PropTypes from 'prop-types';
import './BoxOffice.css';

const MovieCard = ({ movie, onBooking }) => {
  return (
    <div className="movie-card">
      <span className="rank">{movie.rank}</span>
      <div className="poster">
        <img src={movie.posterImg} alt={movie.title} />
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
        {movie.rating && (
          <span className={`rating ${movie.rating.type}`}>{movie.rating.text}</span>
        )}
      </div>
      <div className="info">
        <div className="likes">❤️ {movie.likes}</div>
        <button onClick={() => onBooking(movie.id)}>예매</button>
      </div>
    </div>
  );
};

// PropTypes 정의로 타입 안전성 추가
MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired,
    rank: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    posterImg: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    score: PropTypes.string.isRequired,
    label: PropTypes.shape({
      type: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired
    }),
    rating: PropTypes.shape({
      type: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired
    }),
    likes: PropTypes.string.isRequired
  }).isRequired,
  onBooking: PropTypes.func.isRequired
};

export default MovieCard;