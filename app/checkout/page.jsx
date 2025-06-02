"use client";

import React,{useState} from "react";
import { useSearchParams } from "next/navigation";
import { Box, Text } from "@chakra-ui/react";
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

    const movie = movies.find((m) => m.id === movieId); // moviePoster에서 불러오기

    const total = adult * 15000 + teen * 12000 + senior * 10000 + special * 8000;

    let headerColor='white';
    let headerBg='#1a1a1a';

    return (
        <>
            <Box position="relative" zIndex={2} bg="#1a1a1a">
                <Header headerColor={headerColor} headerBg={headerBg} userInfo={user}/>
            </Box>

            <Box p={10} color="white" bg="#141414" minH="100vh">
                <Text fontSize="4xl" mb={6}>💳 결제 페이지</Text>
                <Text fontSize="3xl" fontWeight="bold">{movie?.title}</Text>
                <Text>지역: {region}</Text>
                <Text>영화관: {theater}</Text>
                <Text>날짜: {date}</Text>
                <Text>시간: {time}</Text>
                <Text>총 결제금액: {total.toLocaleString()}원</Text>
            </Box>
        </>
    );
}
