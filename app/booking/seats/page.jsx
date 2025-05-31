"use client";

import React,{useState} from "react";
import { Box, Text, Grid, Flex, Image, Button } from '@chakra-ui/react';
import { useSearchParams } from 'next/navigation';
import { Header, Footer } from '../../../components';
import { movies } from '../../../components/moviePoster'

export default function SeatsPage() {
    const [user, setUser] = useState(null);
    const searchParams = useSearchParams();
    const movieId = parseInt(searchParams.get('movieId'));
    const region = searchParams.get('region');
    const theater = searchParams.get('theater');
    const date = searchParams.get('date');
    const time = searchParams.get('time');
    const movie = movies.find((m) => m.id === movieId);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const rows = 9;
    const cols = 12;
    const rowLabels = "ABCDEFGHI".split("");
    const [personCounts, setPersonCounts] = useState({
        adult: 0,
        teen: 0,
        senior: 0,
        special: 0,
    });
    const totalPeople =
        personCounts.adult +
        personCounts.teen +
        personCounts.senior +
        personCounts.special;


    let headerColor='white';
    let headerBg='#1a1a1a';

    // const toggleSeat = (seatId) => {
    //     setSelectedSeats((prev) =>
    //       prev.includes(seatId)
    //         ? prev.filter((s) => s !== seatId)
    //         : [...prev, seatId]
    //     );
    // };

    const toggleSeat = (seatId) => {
        if (selectedSeats.includes(seatId)) {
          // 이미 선택된 좌석이면 해제
          setSelectedSeats((prev) => prev.filter((s) => s !== seatId));
        } else {
          // 새로 선택할 경우, 인원 수보다 많으면 막기
          if (selectedSeats.length < totalPeople) {
            setSelectedSeats((prev) => [...prev, seatId]);
          }
        }
      };
      

    const isSelected = (seatId) => selectedSeats.includes(seatId);

    return (
        <>
            {/* 헤더 */}
            <Box position="relative" zIndex={2} bg="#1a1a1a">
                <Header headerColor={headerColor} headerBg={headerBg} userInfo={user}/>
            </Box>

            <Box p={8} color="white" minH="100vh" bg="#141414">
                <Flex 
                    direction={{ base: 'column', md: 'row' }} 
                    gap={10} 
                    align="center"              // 수직 정렬
                    justify="center"            // 수평 정렬
                    minH="calc(100vh - 100px)"
                >
                    {/* 왼쪽: 영화 정보 */}
                    <Box flex="1" maxW="50%" textAlign="center" alignSelf="flex-start" mt="5%" ml="5%">
                        <Box minW="220px" textAlign="left" ml="10%">
                            <Text 
                                fontSize="3xl" 
                                whiteSpace="nowrap"
                                overflow="visible"
                                textOverflow="unset"
                                mb={4}
                            >
                                🎬 {movie?.title || '선택된 영화 없음'}
                            </Text>
                            {movie?.poster && (
                                <Image
                                    src={movie.poster}
                                    alt={movie.title}
                                    borderRadius="md"
                                    objectFit="cover"
                                    w="100%"
                                    // maxH="300px"
                                />
                            )}
                        </Box>
                    </Box>

                    {/* 🎯 예매 정보 + 🪑 선택 좌석을 하나로 묶은 박스 */}
                    <Box
                        p={4}
                        // bg="blackAlpha.600"
                        borderRadius="lg"
                        color="gray.200"
                        minW="280px"
                        maxW="50%"
                        alignSelf="flex-start"
                        mt="7%"
                    >
                        {/* 예매 정보 */}
                        <Box mb={6}>
                            <Text fontWeight="bold" fontSize="2xl" mb={2}>
                                Booking Info
                            </Text>
                            <Text fontSize="xl">
                                🎯 지역: {region || "-"}
                                <br />
                                🏢 영화관: {theater || "-"}
                                <br />
                                📅 날짜: {date || "-"}
                                <br />
                                🕒 시간: {time || "-"}
                            </Text>
                        </Box>

                        <Box mb={6}>
                            {["adult", "teen", "senior", "special"].map((type) => {
                                const labelMap = {
                                adult: "성인",
                                teen: "청소년",
                                senior: "경로",
                                special: "우대",
                            };
                            return (
                                <Flex key={type} align="center" justify="space-between" mb={2}>
                                    <Text>{labelMap[type]}</Text>
                                    <Flex align="center">
                                        <Button
                                            size="sm"
                                            _hover={{bg: "#6B46C1"}}
                                            onClick={() =>
                                            setPersonCounts((prev) => ({
                                                ...prev,
                                                [type]: Math.max(0, prev[type] - 1),
                                            }))
                                            }
                                        >
                                            -
                                        </Button>
                                        <Text mx={2}>{personCounts[type]}</Text>
                                        <Button
                                            size="sm"
                                            _hover={{bg: "#6B46C1"}}
                                            onClick={() =>
                                            setPersonCounts((prev) => ({
                                                ...prev,
                                                [type]: prev[type] + 1,
                                            }))
                                            }
                                        >
                                            +
                                        </Button>
                                    </Flex>
                                </Flex>
                                );
                            })}
                        </Box>


                        {/* 선택 좌석 */}
                        <Box>
                            <Text fontSize="2xl" fontWeight="bold" mb={2}>
                                SEATS
                            </Text>
                            {selectedSeats.length === 0 ? (
                                <Text fontSize="lg" color="gray.400">
                                선택된 좌석이 없습니다.
                                </Text>
                            ) : (
                                <Text fontSize="2xl" fontWeight="bold" color="#6B46C1">
                                {[...selectedSeats]
                                    .sort((a, b) => {
                                    const rowA = a[0];
                                    const rowB = b[0];
                                    const numA = parseInt(a.slice(1));
                                    const numB = parseInt(b.slice(1));
                                    return rowA === rowB ? numA - numB : rowA.localeCompare(rowB);
                                    })
                                    .join(", ")}
                                </Text>
                            )}
                        </Box>
                    </Box>

                    {/* 오른쪽: 좌석 그리드 */}
                <Box flex="3" textAlign="center">
                <Box 
                    mb={12} 
                    textAlign="center" 
                    position="relative" 
                    mx="auto"
                    width="min(100%, 700px)" // 화면 줄어들 때 반응형
                >
                    {/* 스크린 바 */}
                    <Box
                        width="100%"
                        height="30px"
                        borderTop="3px solid #6B46C1"
                        borderLeft="3px solid transparent"
                        borderRight="3px solid transparent"
                        borderRadius="120% / 100%"
                        mx="auto"
                        position="relative"
                        mb={0}
                    />
                    <Text
                        mt={-6}
                        fontSize="xl"
                        fontWeight="bold"
                        letterSpacing="widest"
                        color="gray.300"
                        mb={10}
                    >
                        SCREEN
                    </Text>

                    {/* 좌석 그리드 */}
                    <Grid
                        templateColumns="repeat(3, 40px) 40px repeat(8, 40px) 40px repeat(2, 40px)" // 좌석 포함한 고정 그리드
                        gapX="5px"
                        gapY="20px"
                        mx="auto"
                        justifyContent="center"
                    >
                    {rowLabels.map((rowLabel) => (
                        <React.Fragment key={rowLabel}>
                        {/* 줄 라벨 */}
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
                        {/* 좌석 박스 */}
                        {Array.from({ length: cols + 2 }).map((_, colIndex) => {
                            if (colIndex === 2 || colIndex === 11)
                                return <Box key={colIndex} />;

                            const seatNumber =
                                colIndex +
                                1 +
                                (colIndex > 2 ? -1 : 0) +
                                (colIndex > 11 ? -1 : 0);
                            const seatId = `${rowLabel}${seatNumber}`;

                            return (
                                <Box
                                    key={seatId}
                                    w="40px"
                                    h="40px"
                                    bg={isSelected(seatId) ? "#6B46C1" : "gray.600"}
                                    _hover={{ bg: "#6B46C1", cursor: "pointer" }}
                                    borderRadius="md"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    fontSize="sm"
                                    onClick={() => toggleSeat(seatId)}
                                    border={isSelected(seatId) ? "2px solid white" : "none"}
                                >
                                    {seatNumber}
                                </Box>
                            );
                        })}
                        </React.Fragment>
                    ))}
                    </Grid>
                </Box>
                </Box>

                </Flex>
            </Box>
        </>
    );
  }