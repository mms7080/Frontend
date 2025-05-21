"use client";

import React,{useState} from 'react';
import { useRouter } from 'next/navigation';
import {VStack,Text,Button,Box, Flex} from '@chakra-ui/react';
import MoviePoster from '../../components/moviePoster';
import DateSelector from '../../components/date';
import TimeSelector from '../../components/time';
import {Header,Footer} from '../../components';

import {fetch} from '../../lib/client';     // 나중에 백엔드 데이터를 가지고 올때 사용할 예정 현재는 프론트 테스트용 데이터 기반

export default function BookingPage(){
    const router = useRouter();

    let headerColor='black';
    let headerBg='#F9F9F9';
    let footerColor='black';
    let footerBg='#F9F9F9';
    let footerBorder='#ccc';

    const [selectedMovie, setSelectedMovie] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    const handleProceed = () => {
        router.push(
          `/seat-selection?movieId=${selectedMovie.id}&date=${selectedDate}&time=${selectedTime}`
        );
    };

    return <>
        <Header headerColor={headerColor} headerBg={headerBg}></Header>

        <Text fontSize="5xl" color="black" mb="20px" marginLeft="19%" marginTop="20px">빠른예매</Text>
        
        <VStack spacing="20px" p="20px" overflow="visible">

            {/* 영화 선택 */}
            <MoviePoster 
                onMovieSelect={(movie) => {
                    setSelectedMovie(movie);
                    setSelectedDate(null);
                    setSelectedTime(null);
                }} 
                selectedMovie={selectedMovie} 
            />

            {selectedMovie && (
            <Box
                w="65%"
                p="20px"
                bg="purple"
                borderRadius="15px"
                boxShadow="0 0 15px rgba(0, 0, 0, 0.1)"
                textAlign="center"
                mx="auto"
            >
                <Text fontSize="2xl" fontWeight="semibold" color="white">
                {selectedMovie.title}
                </Text>
                {selectedMovie.description && (
                <Text fontSize="md" color="white" mt="2">
                    {selectedMovie.description}
                </Text>
                )}
            </Box>
            )}

            

            {/* 날짜 선택 (영화 선택 후 표시) */}
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

            {/* 시간 선택 (날짜 선택 후 표시) */}
            {selectedDate && selectedMovie && (
                <TimeSelector 
                    selectedTime={selectedTime} 
                    onTimeSelect={setSelectedTime} 
                />
            )}

            <Button
                mt="auto"
                alignSelf="center"
                colorScheme={selectedTime ? 'purple' : 'gray'}
                size="2xl"
                onClick={handleProceed}
                isDisabled={!selectedTime}
            >
                좌석 선택하기
            </Button>
        </VStack>
        <Footer footerColor={footerColor} footerBg={footerBg} footerBorder={footerBorder}></Footer>
    </>
}