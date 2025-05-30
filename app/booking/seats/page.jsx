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
                <Flex 
                    direction={{ base: 'column', md: 'row' }} 
                    gap={10} 
                    align="center"              // ✅ 수직 정렬
                    justify="center"           // ✅ 수평 정렬
                    minH="calc(100vh - 100px)"
                >
                    {/* 왼쪽: 영화 정보 */}
                    <Box flex="1" maxW="50%" textAlign="center">
                        <Box minW="220px" textAlign="left">
                            <Text fontSize="4xl" fontWeight="" mb={4}>
                                🎬 {movie?.title || '선택된 영화 없음'}
                            </Text>
                            {movie?.poster && (
                                <Image
                                    src={movie.poster}
                                    alt={movie.title}
                                    borderRadius="md"
                                    objectFit="cover"
                                    w="50%"
                                    maxH="300px"
                                />
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
                        {Array.from({ length: cols + 2 }).map((_, colIndex) => ( colIndex != 2 && colIndex != 11 ?
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
                                {(colIndex > 2 ? -1 : 0) + (colIndex > 11 ? -1 : 0) + colIndex + 1}
                            </Box> : <Box/>
                        ))}
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

// "use client";

// import React, { useState } from "react";
// import { Box, Text, Grid, Flex, Image } from "@chakra-ui/react";
// import { useSearchParams } from "next/navigation";
// import { Header, Footer } from "../../../components";
// import { movies } from "../../../components/moviePoster";

// export default function SeatsPage() {
//   const [user, setUser] = useState(null);
//   const searchParams = useSearchParams();
//   const movieId = parseInt(searchParams.get("movieId"));
//   const movie = movies.find((m) => m.id === movieId);

//   const rows = 9;
//   const cols = 12;
//   const rowLabels = "ABCDEFGHI".split("");

//   let headerColor = "white";
//   let headerBg = "#1a1a1a";

//   return (
//     <>
//       {/* 헤더 */}
//       <Box position="relative" zIndex={2} bg="#1a1a1a">
//         <Header headerColor={headerColor} headerBg={headerBg} userInfo={user} />
//       </Box>

//       <Box p={8} color="white" minH="100vh" bg="#141414">
//         <Flex direction={{ base: "column", md: "row" }} gap={10}>
//           {/* 왼쪽: 영화 정보 */}
//           <Box minW="220px" textAlign="center">
//             <Text fontSize="2xl" fontWeight="bold" mb={4}>
//               🎬 {movie?.title || "선택된 영화 없음"}
//             </Text>
//             {movie?.poster && (
//               <Image
//                 src={movie.poster}
//                 alt={movie.title}
//                 borderRadius="md"
//                 objectFit="cover"
//                 w="100%"
//                 maxH="300px"
//               />
//             )}
//           </Box>

// <Box mb={12} textAlign="center" position="relative">
//   {/* 얇고 휘어진 보라색 선 + SCREEN 텍스트 */}
//   <Box textAlign="center" position="relative" mb={6}>
//     {/* 보라색 곡선 SVG */}
//     <Box position="relative" height="30px" mb={2}>
//       <svg
//         width="100%"
//         height="100%"
//         viewBox="0 0 500 30"
//         preserveAspectRatio="none"
//         style={{ position: "absolute", top: 0, left: 0 }}
//       >
//         <path
//           d="M10,20 Q250,0 490,20"
//           fill="transparent"
//           stroke="#9F7AEA"
//           strokeWidth="2"
//         />
//       </svg>
//     </Box>

//     {/* SCREEN 텍스트 */}
//     <Text
//       fontSize="xl"
//       fontWeight="bold"
//       letterSpacing="widest"
//       color="white"
//     >
//       SCREEN
//     </Text>
//   </Box>

//   {/* 좌석 그리드 */}
//   <Grid
//     templateColumns="repeat(13, auto)" // 1열은 라벨 + 12 좌석
//     gapX="5px"
//     gapY="20px"
//     maxW="fit-content"
//     mx="auto"
//   >
//     {rowLabels.map((rowLabel) => (
//       <React.Fragment key={rowLabel}>
//         <Box
//           fontSize="lg"
//           w="40px"
//           h="40px"
//           display="flex"
//           alignItems="center"
//           justifyContent="center"
//           fontWeight="bold"
//         >
//           {rowLabel}
//         </Box>

//         {Array.from({ length: cols }).map((_, colIndex) => {
//           const seatNumber = colIndex + 1;
//           const isAfterCoupleGap = seatNumber === 3;
//           const isAfterSecondCoupleGap = seatNumber === 10;

//           return (
//             <Box
//               key={`${rowLabel}-${seatNumber}`}
//               w="40px"
//               h="40px"
//               bg="gray.600"
//               _hover={{ bg: "#6B46C1", cursor: "pointer" }}
//               borderRadius="sm"
//               display="flex"
//               alignItems="center"
//               justifyContent="center"
//               fontSize="sm"
//               ml={
//                 isAfterCoupleGap || isAfterSecondCoupleGap ? "20px" : "0px"
//               }
//             >
//               {seatNumber}
//             </Box>
//           );
//         })}
//       </React.Fragment>
//     ))}
//   </Grid>
// </Box>

//         </Flex>
//       </Box>
//     </>
//   );
// }