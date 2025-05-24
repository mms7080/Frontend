"use client";

import React, { useState } from 'react';
import MoviePoster, { movies } from '../../components/bookingPageMovieList';
import BookingForm from '../../components/bookingPage';

export default function BookingPage() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [bookingInfo, setBookingInfo] = useState(null);

  const handleBookingComplete = info => {
    setBookingInfo(info);
    console.log('예매 정보:', info);
    // 실제 API 호출 등으로 연결
  };

  return (
    <>
      <MoviePoster
        selectedMovie={selectedMovie}
        onMovieSelect={setSelectedMovie}
      />

      {selectedMovie && (
        <BookingForm onBookingComplete={handleBookingComplete} />
      )}

      {bookingInfo && (
        <Box mt={6}>
          <Text>✓ {selectedMovie.title} 예매가 완료되었습니다!</Text>
          <Text>지역: {bookingInfo.region}</Text>
          <Text>상영관: {bookingInfo.theater}</Text>
          <Text>날짜: {bookingInfo.date}</Text>
          <Text>시간: {bookingInfo.time}</Text>
        </Box>
      )}
    </>
  );
}