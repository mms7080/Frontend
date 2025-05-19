"use client";

import React,{useState,useEffect} from 'react';
import {Flex,Box,VStack,Input,HStack,Button,Text} from '@chakra-ui/react';
import MoviePoster from '../../components/moviePoster';
import DateSelector from '../../components/date';
import TimeSelector from '../../components/time';
import {Header,Footer} from '../../components';

import {fetch} from '../../lib/client';

export default function BookingPage(){

    let headerColor='black';
    let headerBg='#F9F9F9';
    let footerColor='black';
    let footerBg='#F9F9F9';
    let footerBorder='#ccc';

    const [selectedMovie, setSelectedMovie] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);

    return <>
        <Header headerColor={headerColor} headerBg={headerBg}></Header>

        <span style={{color:'#555', textAlign:'center'}}>영화 예매</span>

        <VStack spacing="20px" p="20px">
                {selectedMovie && selectedMovie.title && (
                    <Text fontSize="2xl" fontWeight="bold" mb="20px">
                        {selectedMovie.title}
                    </Text>
                )}

            {/* 영화 선택 */} 
            <MoviePoster onMovieSelect={setSelectedMovie} selectedMovie={selectedMovie} />

            {/* 날짜 선택 (영화 선택 후 표시) */}
            {selectedMovie && <DateSelector selectedMovie={selectedMovie} selectedDate={selectedDate} onDateSelect={setSelectedDate} />}

            {/* 시간 선택 (날짜 선택 후 표시) */}
            {selectedDate && <TimeSelector selectedDate={selectedDate} selectedMovie={selectedMovie} onTimeSelect={console.log} />}
        </VStack>
        <Footer footerColor={footerColor} footerBg={footerBg} footerBorder={footerBorder}></Footer>
    </>
}