'use client';

import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { VStack, Grid, Flex, Box, useMediaQuery } from '@chakra-ui/react';
import MovieCard from '../movie/moviecard';
import { fetch } from "../../lib/client";

export default function Movies({ userInfo, movieInfo }) {
    const [sortkey, setSortkey] = useState('likeNumber');
    const [rdcolor, setrdColor] = useState('white');
    const [lncolor, setlnColor] = useState('gray.500');
    const [isMobile] = useMediaQuery("(max-width: 768px)");

    const [user, setUser] = useState(userInfo);
    const [movies, setMovies] = useState(movieInfo);

    useEffect(() => {
        const syncUserData = async () => {
            if (userInfo) {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`, {
                        method: 'GET',
                        credentials: 'include'
                    });
                    const updatedUser = res;
                    setUser(updatedUser);

                    const movieRes = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/movie`);
                    setMovies(Object.values(movieRes));
                } catch (err) {
                    console.log('Error syncing user data:', err.message);
                }
            }
        };
        syncUserData();

        const handlePageShow = (event) => {
            if (event.persisted) {
                syncUserData();
            }
        };
        window.addEventListener('pageshow', handlePageShow);

        return () => {
            window.removeEventListener('pageshow', handlePageShow);
        };
    }, [userInfo]);

    return <VStack w='100%' bg='#141414' pt='80px' pb='50px'>
        <h1 style={{ color: 'white', fontSize: 25, paddingBottom: 50 }}>박스 오피스</h1>

        <Flex w={{ base: '100%', md: '1250px' }} justifyContent='space-between' pb={{ base: '10px', md: '0px' }}>
            <Flex gap='10px' ml={{ base: '50px', md: '0px' }}>
                <Flex color={rdcolor} _hover={{ cursor: 'pointer' }} onClick={(e) => {
                    setSortkey('likeNumber');
                    setrdColor((rdcolor === 'white') ? 'gray.500' : 'white');
                    setlnColor((lncolor === 'white') ? 'gray.500' : 'white');
                }}>좋아요순</Flex>
                <Flex color='white'>|</Flex>
                <Flex color={lncolor} _hover={{ cursor: 'pointer' }} onClick={(e) => {
                    setSortkey('releaseDate');
                    setrdColor((rdcolor === 'white') ? 'gray.500' : 'white');
                    setlnColor((lncolor === 'white') ? 'gray.500' : 'white');
                }}>최신순</Flex>
            </Flex>
            <Link href='/movie'><Flex color='white' _hover={{ color: 'gray.500' }} mr={{ base: '50px', md: '0px' }}>더 보기</Flex></Link>
        </Flex>

        <Grid templateColumns={{ base: '1fr', md: 'repeat(4,280px)' }} gap='50px' overflow='visible'>
            {(sortkey === 'releaseDate')
                ?
                movies.sort((a, b) => b.releaseDate.localeCompare(a.releaseDate)).map((movie, index) => {
                    if (index < (!isMobile ? 8 : 4))
                        return (<Box overflow='visible' key={movie.id}>
                            <MovieCard
                                user={user}
                                movie={movie}
                                setMovies={setMovies}
                            /></Box>);
                }) :
                movies.sort((a, b) => b.likeNumber - a.likeNumber).map((movie, index) => {
                    if (index < (!isMobile ? 8 : 4))
                        return (<Box overflow='visible' key={movie.id}>
                            <MovieCard
                                user={user}
                                movie={movie}
                                setMovies={setMovies}
                            /></Box>);
                })}
        </Grid>
    </VStack>
}