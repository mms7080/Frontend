import React, { useState } from 'react';
import './BoxOffice.css'; // CSS 스타일을 별도 파일로 분리
import MovieCard from './movie'; // MovieCard 컴포넌트 import

const BoxOffice = () => {
  // 영화 데이터 상태 관리
  const [movies] = useState([
    {
      id: 1,
      rank: 1,
      title: "어벤져스 : 엔드게임",
      posterImg: "https://upload.wikimedia.org/wikipedia/ko/thumb/f/f2/%EC%96%B4%EB%B2%A4%EC%A0%B8%EC%8A%A4-_%EC%97%94%EB%93%9C%EA%B2%8C%EC%9E%84_%ED%8F%AC%EC%8A%A4%ED%84%B0.jpg/1200px-%EC%96%B4%EB%B2%A4%EC%A0%B8%EC%8A%A4-_%EC%97%94%EB%93%9C%EA%B2%8C%EC%9E%84_%ED%8F%AC%EC%8A%A4%ED%84%B0.jpg",
      description: "타노스 위협으로부터 몸을 지키기 위해 거대한 벽을 쌓고 그 안에서...",
      score: "9.9",
      label: { type: "purple", text: "MEGA ONLY" },
      rating: { type: "orange", text: "15" },
      likes: "7.6k"
    },
    {
      id: 2,
      rank: 2,
      title: "범죄도시4",
      posterImg: "https://i.namu.wiki/i/KwJ2dfIySu2k8JWlK3nD-gS7A9G-2I2EWKkNjoVRqaHabjK88STUo8FXi545XV6Pe8ERSX5DjF4e5k0IkOvznQ.webp",
      description: "타노스 위협으로부터 몸을 지키기 위해 거대한 벽을 쌓고 그 안에서...",
      score: "9.6",
      rating: { type: "yellow", text: "12" },
      likes: "496"
    },
    {
      id: 3,
      rank: 3,
      title: "귀멸의 칼날 : 무한성",
      posterImg: "https://i.namu.wiki/i/YvPBZ1kzk8Dku4HhOC2FGB7xKVXj5bpg8cSdRWsAZg-3Knqu5LcWJchrZDIVmz-08V3OV9uFLMfCRNCZRcnTxQ.webp",
      description: "타노스 위협으로부터 몸을 지키기 위해 거대한 벽을 쌓고 그 안에서...",
      score: "9.1",
      rating: { type: "orange", text: "15" },
      likes: "223"
    },
    {
      id: 4,
      rank: 4,
      title: "승부",
      posterImg: "https://img.megabox.co.kr/SharedImg/2025/03/27/O6RnDMOAnUw6geDdlaAXRlkqgy0mSSDb_420.jpg",
      description: "타노스 위협으로부터 몸을 지키기 위해 거대한 벽을 쌓고 그 안에서...",
      score: "8.3",
      label: { type: "gray", text: "Dolby" },
      rating: { type: "red", text: "19" },
      likes: "283"
    }
  ]);

  // 예매 버튼 핸들러
  const handleBooking = (movieId) => {
    console.log(`영화 ID ${movieId} 예매하기`);
    // 여기에 예매 로직 추가
  };

  return (
    <section className="boxoffice">
      <h2>박스오피스</h2>
      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard 
            key={movie.id}
            movie={movie}
            onBooking={handleBooking}
          />
        ))}
      </div>
    </section>
  );
};

export default BoxOffice;