"use client";

import React, { useState,useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, VStack, Text, Button } from '@chakra-ui/react';
import MoviePoster from '../../components/moviePoster';
import DateSelector from '../../components/date';
import TimeSelector from '../../components/time';
import { Header, Footer } from '../../components';

export default function BookingPage() {
    const [user, setUser] = useState(null);
    const router = useRouter();
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    let headerColor='white';
    let headerBg='#1a1a1a';
    let footerColor='white';
    let footerBg='#1a1a1a';
    let footerBorder='transparent';

    useEffect(() => {
        document.title = '예매 - 빠른 예매';

        (async ()=>{
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);
                setUser(res);
            } catch (e) {}
        })();
    }, []);

    const handleProceed = () => {
        router.push(
        `/seat-selection?movieId=${selectedMovie.id}&date=${selectedDate}&time=${selectedTime}`
        );
    };

    return (
    <>
        {/* <Header headerColor="black" headerBg="#F9F9F9" /> */}
        <Box position="relative" zIndex={2} bg="#1a1a1a">
            <Header headerColor={headerColor} headerBg={headerBg} userInfo={user}/>
        </Box>
      

        {/* Blur wrapper excluding Header & Footer */}
        <Box position="relative" flex="1" minH="calc(100vh - 128px)">
            {/* Background Blur and Overlay */}
            {selectedMovie && (
            <>
                <Box
                position="absolute"
                top="0"
                left="0"
                width="100%"
                height="100%"
                bgImage={`url(${selectedMovie.poster})`}
                bgSize="cover"
                bgPosition="center"
                filter="blur(5px)"
                transform="scale(1.1)"
                />
                <Box
                position="absolute"
                top="0"
                left="0"
                width="100%"
                height="100%"
                bg="rgba(0,0,0,0.4)"
                />
            </>
            )}

            {/* Main Content Stack on top of blur */}
            <Box position="relative" zIndex="1">
            <VStack spacing="20px" p="20px" overflow="visible" align="stretch">
                <Text fontSize="5xl" color="white" textAlign="center">
                빠른예매
                </Text>

                {/* 선택된 영화 정보 */}
                {selectedMovie && (
                <Box
                    w="100%"
                    maxW="600px"
                    bg="rgba(255,255,255,0.1)"
                    borderRadius="15px"
                    p="20px"
                    mx="auto"
                    textAlign="center"
                >
                    <Text fontSize="2xl" fontWeight="bold" color="white">
                    {selectedMovie.title}
                    </Text>
                    {selectedMovie.description && (
                    <Text fontSize="md" color="white" mt="2">
                        {selectedMovie.description}
                    </Text>
                    )}
                </Box>
                )}

                {/* 영화 선택 컴포넌트 */}
                <MoviePoster
                onMovieSelect={(movie) => {
                    setSelectedMovie(movie);
                    setSelectedDate(null);
                    setSelectedTime(null);
                }}
                selectedMovie={selectedMovie}
                />

                {/* 날짜 선택 */}
                {selectedMovie && (
                <DateSelector
                    selectedMovie={selectedMovie}
                    selectedDate={selectedDate}
                    onDateSelect={(date) => {
                    setSelectedDate(date);
                    setSelectedTime(null);
                    }}
                />
                )}

                {/* 시간 선택 */}
                {selectedDate && (
                <TimeSelector
                    selectedTime={selectedTime}
                    onTimeSelect={setSelectedTime}
                />
                )}

                {/* 좌석 선택 이동 버튼 */}
                <Button
                mt="auto"
                alignSelf="center"
                colorScheme={selectedTime ? 'purple' : 'gray'}
                size="lg"
                onClick={handleProceed}
                isDisabled={!selectedTime}
                >
                좌석 선택하기
                </Button>
            </VStack>
            </Box>
        </Box>

        {/* <Box position="relative" zIndex={2} bg="#F9F9F9">
            <Footer footerColor={footerColor} footerBg={footerBg} footerBorder={footerBorder}></Footer>
        </Box> */}
        <Box position="relative" zIndex={2} bg="#1a1a1a">
            <Footer footerColor={footerColor} footerBg={footerBg} footerBorder={footerBorder} />
        </Box>
    </>
  );
}