"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Box, Text, Flex, Button } from "@chakra-ui/react";
import { movies } from '../../components/moviePoster';
import { Header, Footer } from '../../components';

export default function CheckoutPage() {
  const [user, setUser] = useState(null);
  const params = useSearchParams();

  const movieId = parseInt(params.get("movieId"));
  const region = params.get("region");
  const theater = params.get("theater");
  const date = params.get("date");
  const time = params.get("time");

  const adult = parseInt(params.get("adult") || "0");
  const teen = parseInt(params.get("teen") || "0");
  const senior = parseInt(params.get("senior") || "0");
  const special = parseInt(params.get("special") || "0");

  const movie = movies.find((m) => m.id === movieId);

  const total = adult * 15000 + teen * 12000 + senior * 10000 + special * 8000;

  let headerColor = 'white';
  let headerBg = '#1a1a1a';

  useEffect(() => {
    document.title = "예매 - 결제";
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setUser(data);
      } catch (e) {
        setUser(null);
      }
    })();
  }, []);

  return (
    <>
      {/* 헤더 */}
      <Box position="relative" zIndex={2} bg={headerBg}>
        <Header headerColor={headerColor} headerBg={headerBg} userInfo={user} />
      </Box>

      {/* 본문 */}
      <Box p={10} color="white" bg="#141414" minH="100vh">
        <Box maxW="600px" mx="auto" bg="#1f1f1f" p={8} borderRadius="xl" boxShadow="lg">
          <Text fontSize="4xl" fontWeight="bold" mb={6} textAlign="center">💳 결제 페이지</Text>

          <Box mb={4}>
            <Text fontSize="2xl" fontWeight="bold" color="#6B46C1" mb={1}>
              🎬 {movie?.title || "영화 정보 없음"}
            </Text>
            <Text>📍 지역: {region}</Text>
            <Text>🏢 영화관: {theater}</Text>
            <Text>📅 날짜: {date}</Text>
            <Text>🕒 시간: {time}</Text>
          </Box>

          <Box mt={6} fontSize="lg">
            <Text>👤 성인: {adult}명 × 15,000원</Text>
            <Text>🧒 청소년: {teen}명 × 12,000원</Text>
            <Text>👵 경로: {senior}명 × 10,000원</Text>
            <Text>💳 우대: {special}명 × 8,000원</Text>
          </Box>

          <Box mt={6} textAlign="right">
            <Text fontSize="2xl" fontWeight="bold" color="#6B46C1">
              총 결제 금액: {total.toLocaleString()}원
            </Text>
          </Box>

          <Button
            mt={8}
            colorScheme="purple"
            size="lg"
            width="100%"
            onClick={() => alert("결제 완료!")}
          >
            결제하기
          </Button>
        </Box>
      </Box>
    </>
  );
}
