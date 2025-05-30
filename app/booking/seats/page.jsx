"use client";

import React,{useState} from "react";
import { Box, Text, Grid, Wrap, WrapItem } from '@chakra-ui/react';
import { useSearchParams } from 'next/navigation';
import { Header, Footer } from '../../../components';

export default function SeatsPage() {
    const [user, setUser] = useState(null);
    const searchParams = useSearchParams();
    const movieTitle = searchParams.get('movieTitle');

    let headerColor='white';
    let headerBg='#1a1a1a';

    return (
        <>
            {/* 헤더 */}
            <Box position="relative" zIndex={2} bg="#1a1a1a">
                <Header headerColor={headerColor} headerBg={headerBg} userInfo={user}/>
            </Box>

            <Box p={8} color="white" minH="100vh" bg="#141414">
                <Text fontSize="4xl" fontWeight="bold" mb={8}>
                    🎬 {movieTitle || '선택된 영화 없음'}
                </Text>

                {/* 좌석 그리드 */}
                <Grid
                    templateColumns="repeat(12, auto)"
                    gapX="5px"
                    gapY="20px"
                    maxW="fit-content"
                    mx="auto"
                    >
                    {Array.from({ length: 12 * 9 }).map((_, i) => (
                        <Box
                        key={i}
                        w="40px"
                        h="40px"
                        bg="gray.600"
                        _hover={{ bg: '#6B46C1', cursor: 'pointer' }}
                        borderRadius="sm"
                        />
                    ))}
                </Grid>
            </Box>
        </>
    );
  }