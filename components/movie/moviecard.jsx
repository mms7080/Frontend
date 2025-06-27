import React, {useState, useEffect} from 'react';
import Link from 'next/link';
import { createIcon } from '@chakra-ui/react';
import './moviecard.css';
import Modal, { useModal } from './modal';
import Spinner from '../Spinner';

const HeartIcon = createIcon({
  displayName: "HeartIcon",
  path: (
    <>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path
        stroke="white"
        strokeWidth="1.5"
        fill="currentColor"
        d="M19.5 13.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"
      />
    </>
  ),
  viewBox: "0 0 28 28"
});

const MovieCard = ({ movie, user, rank, crit, preloadedData}) => {

  const [liked, setLiked] = useState(user?.likemovies.includes(movie.id));
  const [likeNumber, setLikeNumber] = useState(movie.likeNumber > 999 ? Math.floor(movie.likeNumber / 100) / 10 + 'k' : movie.likeNumber);
  const [score, setScore] = useState(preloadedData?.score || "N/A");
  const [reserveRate, setReserveRate] = useState(preloadedData?.reserveRate?.reserveRate || "N/A");
  const [loaded, setLoaded] = useState(!!preloadedData);
  const {isModalOpen, isModalVisible, openModal, closeModal, modalContent} = useModal();

  useEffect(() => {

    if (preloadedData) {
      setScore(preloadedData.score);
      setReserveRate(preloadedData.reserveRate);
      setLoaded(true);
      return;
    }

    (async() => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/review/${movie.id}`);
        if(res.ok) {
          const data = await res.json();
          if(data.length > 0) {
            let sum = 0;
            for(let review of data)
              sum += review.score;
            let avg = (sum / data.length).toFixed(1);
            setScore(avg);
          } else {
            setScore("없음");
          }
        }
      } catch(err) {
        console.log("avgScore ERROR! " + err.message);
        setScore("N/A");
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/movie/reserveRate/${movie.id}`)
        if(res.ok) {
          const data =  await res.json();
          // console.log(data);
          // setReserveRate(data);
          setReserveRate(data);
        }
      } catch(err) {
        console.log("getReserveRate ERROR! " + err.message);
      }
      setLoaded(true);
    })();
  }, [movie, preloadedData])

  const likeChange = async () => {
    if(!user)
      openModal('로그인이 필요합니다.');
    else
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/movie/update/like?id=${movie.id}&updown=${liked ? "down" : "up"}`);
        if(res.ok) {
          const data = await res.json();
          setLiked(!liked);
          setLikeNumber(data > 999 ? Math.floor(data / 100) / 10 + 'k' : data);
          const res2 = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/movieLikeToggle/${movie.id}`, {
            method: 'GET',
            credentials: 'include' 
          });
          if(res2.ok) {
            const data2 = await res2.json();
            user.likemovies = data2;
          }
        }
      } catch (err) {
        console.log(err.message);
      };
  };

  const roundRate = (rate) => {
    return Math.round(rate * 10) / 10;
  }

  return (<>
    <div className="movie-card">
      { rank && (
        <div className='rank-box'>
          <span className="rank">
            {(crit ? `${crit} : ${rank}위` : `${rank}위`)}
          </span>
        </div>
      )}
      <Link href={"/detail/" + movie.id}>
        <div className="poster">
          <img src={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}${movie.poster}`} alt={movie.title} loading='lazy' />
            <div className="overlay">
              <p>
                {movie.title} <br /> <br />
                <span className='description'>{movie.description}</span><br /> <br />
                관람평 <span className="score">{loaded ? score : movie.score}</span>
                <br /> <br />예매율 <span>{loaded ? roundRate(reserveRate) : movie.reserveRate}%</span>
                <br/>개봉일 <span>{movie.releaseDate}</span>
              </p>
            </div>
            <div className='label-container'>
              {movie.label && (
              <>
                {movie.label.includes("IMAX") && (<span className={`label gray`}>IMAX</span>)}
                {movie.label.includes("4DX") && (<span className={`label gray`}>4DX</span>)}
              </>
              )}
            </div>
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
          <HeartIcon size="lg" color={liked ? "white" : "transparent"} />
          <div className="likes">
            {likeNumber}
          </div>
        </button>
        <Link style={{width:'30%'}} href={`/booking?id=${movie.id}`}>
          <button className="reserve-button" style={{width:'100%'}}>예매</button>
        </Link>
      </div>
    </div>
  {isModalOpen && (<Modal
  isModalOpen={isModalOpen}
  isModalVisible={isModalVisible}
  closeModal={closeModal}
  content={modalContent}/>)}
  </>);
};

export default MovieCard;