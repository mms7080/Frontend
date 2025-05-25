import React, {useState} from 'react';
import Link from 'next/link';
import { createIcon } from '@chakra-ui/react';
import './moviecard.css';

const HeartIcon = createIcon({
  displayName: "HeartIcon",
  path: (
    <>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path
        stroke="red"
        strokeWidth="1.5"
        fill="currentColor"
        d="M19.5 13.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"
      />
    </>
  ),
  viewBox: "0 0 28 28"
});

const MovieCard = ({ movie }) => {

  const [liked, likedController] = useState(false);
  const likeChange = () => {likedController(!liked)};

  return (
    <div className="movie-card">
      <span className="rank">{movie.rank}</span>
<Link href="/detail">
        <div className="poster">
          <img src={movie.poster} alt={movie.title} />
          <div className="overlay">
            <p>
              {movie.title} <br /> <br />
              <span className='description'>{movie.description}</span><br /> <br />
              관람평 <span className="score">{movie.score}</span>
              <br /> <br />개봉일 <span>{movie.releaseDate}</span>
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
</Link>
      <div className="info">
        <button 
          className="like-button"
          onClick={likeChange}
        >
          <HeartIcon size="lg" color={liked ? "red" : "transparent"} />
          <div className="likes">
            {movie.likeNumber}
          </div>
        </button>
        <button className="reserve-button" onClick={() => {}}>예매</button>
      </div>
    </div>
  );
};

export default MovieCard;