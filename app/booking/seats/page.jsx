"use client";

import React,{useState} from "react";
import { Box, Text, Grid, Flex, Image } from '@chakra-ui/react';
import { useSearchParams } from 'next/navigation';
import { Header, Footer } from '../../../components';
import { movies } from '../../../components/moviePoster'

export default function SeatsPage() {
    const [user, setUser] = useState(null);
    const searchParams = useSearchParams();
    const movieId = parseInt(searchParams.get('movieId'));
    const movie = movies.find((m) => m.id === movieId);

    const rows = 9;
    const cols = 12;
    const rowLabels = "ABCDEFGHI".split("");

    let headerColor='white';
    let headerBg='#1a1a1a';

    return (
        <>
            {/* 헤더 */}
            <Box position="relative" zIndex={2} bg="#1a1a1a">
                <Header headerColor={headerColor} headerBg={headerBg} userInfo={user}/>
            </Box>

            <Box p={8} color="white" minH="100vh" bg="#141414">
                <Flex direction={{ base: 'column', md: 'row' }} gap={10}>
                    {/* 왼쪽: 영화 정보 */}
                    <Box minW="220px" textAlign="center">
                        <Text fontSize="2xl" fontWeight="bold" mb={4}>
                            🎬 {movie?.title || '선택된 영화 없음'}
                        </Text>
                        {movie?.poster && (
                            <Image
                                src={movie.poster}
                                alt={movie.title}
                                borderRadius="md"
                                objectFit="cover"
                                w="100%"
                                maxH="300px"
                            />
                        )}
                    </Box>

                    {/* 오른쪽: 좌석 그리드 */}
                    <Box mb={12} textAlign="center" position="relative">
                        <Box
                            width="100%"
                            height="8%"
                            borderTopRadius="full"
                            bg="#6B46C1"
                            mx="auto"
                            mb={5}
                            position="relative"
                            _after={{
                                content: '""',
                                position: "absolute",
                                top: "100%",
                                left: "0",
                                width: "100%",
                                height: "4px",
                                bg: "#6B46C1",
                            }}
                        >
                            <Text
                                mt={2}
                                fontSize="xl"
                                fontWeight="bold"
                                letterSpacing="widest"
                                color="white"
                            >
                                SCREEN
                            </Text>
                        </Box>
                        <Grid
                            templateColumns="repeat(13, auto)" // 1열은 라벨, 12열은 좌석
                            gapX="5px"
                            gapY="20px"
                            maxW="fit-content"
                            mx="auto"
                        >
                            {rowLabels.map((rowLabel, rowIndex) => (
                                <React.Fragment key={rowLabel}>
                                {/* 왼쪽 알파벳 라벨 */}
                                <Box
                                    fontSize="lg"
                                    w="40px"
                                    h="40px"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    fontWeight="bold"
                                >
                                    {rowLabel}
                                </Box>
                                {/* 각 좌석 */}
                                {Array.from({ length: cols }).map((_, colIndex) => (
                                    <Box
                                    key={`${rowLabel}-${colIndex + 1}`}
                                    w="40px"
                                    h="40px"
                                    bg="gray.600"
                                    _hover={{ bg: "#6B46C1", cursor: "pointer" }}
                                    borderRadius="sm"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    fontSize="sm"
                                    >
                                    {colIndex + 1}
                                    </Box>
                                ))}
                                </React.Fragment>
                            ))}
                        </Grid>
                    </Box>
                </Flex>
            </Box>
        </>
    );
  }