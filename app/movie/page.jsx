"use client";

import React,{useEffect,useState} from 'react';
import {Text, Flex, Box, Grid, GridItem} from '@chakra-ui/react';

import Movie, {movie} from '../../components/movie/movie';
import {Header,Footer} from '../../components';

import {fetch} from '../../lib/client';

export default function Moviepage(){
    
    useEffect(() => {
        document.title = '전체 영화 - 필모라라';
    }, []);

    return <>
        <Header headerColor="white" headerBg="#1a1a1a"/>
        <Box bg="white" pt={20} pb={10} px={6} maxW="1280px" mx="auto">
            <Text fontSize="xl" fontWeight="bold" mb={6} borderLeft="4px solid #5f0080" pl={2}>
                전체 영화
            </Text>
            <Grid templateColumns='repeat(4, 1fr)' gap='40px' w='100%' alignItems='center'>
                    <Movie name='Fields of Destiny' rate='' releaseDate='0000.00.00' likeNumber='5.3k' src='https://res.cloudinary.com/upwork-cloud/image/upload/c_scale,w_1000/v1700795880/catalog/1600659718750367744/xiry6ufbjttckqxpfzrw.jpg'></Movie>
                    <Movie name='Killer Advice' rate='' releaseDate='0000.00.00' likeNumber='2.1k' src='https://res.cloudinary.com/upwork-cloud/image/upload/c_scale,w_1000/v1700796426/catalog/1600659718750367744/iqmiudmmo6s7zcofwmpf.jpg'></Movie>
                    <Movie name='InterStella' rate='12' releaseDate='2014.11.06' likeNumber='1.5k' src='https://rukminim2.flixcart.com/image/850/1000/l2dmky80/poster/y/f/b/small-poster-interstellar-sl407-wall-poster-13x19-inches-matte-original-imagdqezkfchjkhz.jpeg?q=20&crop=false'></Movie>
                    <Movie name='My Name is Alfred Hitchcock' rate='' releaseDate='0000.00.00' likeNumber='1.3k' src='https://www.mvtimes.com/mvt/uploads/2024/11/film-my-name-alfred-hitchcock-2.jpg'></Movie>
                    <Movie name='어벤져스 엔드게임' rate='12' releaseDate='2019.04.24' likeNumber='986' src='https://upload.wikimedia.org/wikipedia/ko/thumb/f/f2/%EC%96%B4%EB%B2%A4%EC%A0%B8%EC%8A%A4-_%EC%97%94%EB%93%9C%EA%B2%8C%EC%9E%84_%ED%8F%AC%EC%8A%A4%ED%84%B0.jpg/1200px-%EC%96%B4%EB%B2%A4%EC%A0%B8%EC%8A%A4-_%EC%97%94%EB%93%9C%EA%B2%8C%EC%9E%84_%ED%8F%AC%EC%8A%A4%ED%84%B0.jpg'></Movie>
                    <Movie name='범죄도시 4' rate='15' releaseDate='2024.04.24' likeNumber='734' src='https://i.namu.wiki/i/KwJ2dfIySu2k8JWlK3nD-gS7A9G-2I2EWKkNjoVRqaHabjK88STUo8FXi545XV6Pe8ERSX5DjF4e5k0IkOvznQ.webp'></Movie>
                    <Movie name='귀멸의칼날 무한성편' releaseDate='2025.08.22' rate='19' likeNumber='521' src='https://i.namu.wiki/i/YvPBZ1kzk8Dku4HhOC2FGB7xKVXj5bpg8cSdRWsAZg-3Knqu5LcWJchrZDIVmz-08V3OV9uFLMfCRNCZRcnTxQ.webp'></Movie>
                    <Movie name='승부' rate='12' releaseDate='2025.03.26' likeNumber='342' src='https://img.megabox.co.kr/SharedImg/2025/03/27/O6RnDMOAnUw6geDdlaAXRlkqgy0mSSDb_420.jpg'></Movie>
            </Grid>
        </Box>
        <Footer footerColor="white" footerBg="#1a1a1a" footerBorder="transparent" />
        </>;
}