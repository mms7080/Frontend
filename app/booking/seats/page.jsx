"use client";

import React,{useState, useEffect} from "react";
import { Box, Text, Grid, Flex, Image, Button } from '@chakra-ui/react';
import { useSearchParams } from 'next/navigation';
import { Header, Footer } from '../../../components';
import { movies } from '../../../components/moviePoster'
import { useRouter } from 'next/navigation';

export default function SeatsPage() {
    let headerColor='white';
    let headerBg='#1a1a1a';

    const router = useRouter();
    const [user, setUser] = useState(null);
    const searchParams = useSearchParams();
    const movieId = parseInt(searchParams.get('movieId'));
    const region = searchParams.get('region');
    const theater = searchParams.get('theater');
    const date = searchParams.get('date');
    const time = searchParams.get('time');
    // const movie = movies.find((m) => m.id === movieId);
    const [movie, setMovie] = useState(null);
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

    const isButtonDisabled = (selectedSeats.length === 0 || selectedSeats.length < totalPeople);

    // const disabledSeats = ["A3", "A4", "A9", "A10"];
    // const bookedSeats =["B3", "B4"];

    const [seatData, setSeatData] = useState([]);

    const bookedSeats = seatData
    .filter(seat => seat.status === "RESERVED")
    .map(seat => seat.fullSeatName);

    const disabledSeats = seatData
    .filter(seat => seat.status === "UNAVAILABLE")
    .map(seat => seat.fullSeatName);


    useEffect(() => {
        const fetchSeats = async () => {
          try {
            const showtimeId = searchParams.get("showtimeId"); // URL에서 가져오기
            const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/api/booking/showtimes/${showtimeId}/seats`);
            const json = await res.json();
            setSeatData(json.data || []);
          } catch (e) {
            console.error("좌석 정보 로딩 실패", e);
          }
        };
        fetchSeats();
      }, []);

      useEffect(() => {
        const fetchMovie = async () => {
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/movie/${movieId}`);
            if (!res.ok) throw new Error('영화 정보를 불러오는 데 실패했습니다.');
            const data = await res.json();
      
            const baseURL = process.env.NEXT_PUBLIC_SPRING_SERVER_URL;
            const updated = {
              ...data,
              poster: baseURL + data.poster,
              wideImage: data.wideImage ? baseURL + data.wideImage : null,
            };
            setMovie(updated);
          } catch (e) {
            console.error("영화 정보 로딩 실패", e);
          }
        };
      
        fetchMovie();
      }, [movieId]);
      

    const toggleSeat = (seatId) => {
        if (bookedSeats.includes(seatId)) return; // 예약 완료 좌석 클릭 막기
    
        const isDisabledSeat = disabledSeats.includes(seatId);
    
        if (selectedSeats.includes(seatId)) {
            setSelectedSeats((prev) => prev.filter((s) => s !== seatId));
        } else {
            const normalSeats = selectedSeats.filter(s => !disabledSeats.includes(s));
            const selectedDisabledSeats = selectedSeats.filter(s => disabledSeats.includes(s));
    
            if (isDisabledSeat) {
                if (selectedDisabledSeats.length >= personCounts.special) {
                    alert("선택한 우대 좌석이 우대 인원 수를 초과했습니다.");
                    return;
                }
            } else {
                if (normalSeats.length >= (totalPeople - personCounts.special)) {
                    alert("선택한 일반 좌석이 인원 수를 초과했습니다.");
                    return;
                }
            }
            setSelectedSeats((prev) => [...prev, seatId]);
        }
    };    

    const handlePayment = () => {
        router.push(
          `/checkout?movieId=${movieId}` +
          `&region=${encodeURIComponent(region)}` +
          `&theater=${encodeURIComponent(theater)}` +
          `&date=${encodeURIComponent(date)}` +
          `&time=${encodeURIComponent(time)}` +
          `&adult=${personCounts.adult}` +
          `&teen=${personCounts.teen}` +
          `&senior=${personCounts.senior}` +
          `&special=${personCounts.special}` + 
          `&seats=${selectedSeats.join(",")}`
        );
    };

    const handleReset = () => {
        setSelectedSeats([]);
        // setPersonCounts({
        //     adult: 0,
        //     teen: 0,
        //     senior: 0,
        //     special: 0,
        // });
    };
      
    const isSelected = (seatId) => selectedSeats.includes(seatId);

    const getSeatColor = (seatId) => {
        if (selectedSeats.includes(seatId)) return "#6B46C1"; // 선택한 좌석
        if (disabledSeats.includes(seatId)) return "blue.500"; // 장애인석
        if (bookedSeats.includes(seatId)) return "gray.300";    // 예약완료된 좌석
        return "gray.600"; // 일반 좌석
    };      

    useEffect(() => {
        document.title = "예매 - 좌석선택";
        (async () => {
          try {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`,
              {
                credentials: "include",
              }
            );
            if (!res.ok) throw new Error();
            const data = await res.json();
            setUser(data);
          } catch (e) {
            setUser(null);
          }
        })();
    }, []);

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
                    overflow="visible"
                >
                    {/* 왼쪽: 영화 정보 */}
                    <Box flex="1" maxW="50%" textAlign="center" alignSelf="flex-start" mt="5%" ml="8%">
                        <Box minW="270px" maxW="400px" mx="auto">
                            <Text 
                                fontSize="3xl" 
                                whiteSpace="nowrap"
                                overflow="visible"
                                textOverflow="unset"
                                mb={4}
                            >
                                {movie?.title || '선택된 영화 없음'}
                            </Text>
                            {movie?.poster && (
                                <Image
                                    src={movie.poster}
                                    alt={movie.title}
                                    borderRadius="md"
                                    objectFit="cover"
                                    w="100%"
                                    maxW="400px"
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
                            <Text fontWeight="normal" fontSize="3xl" mb={2} textShadow="6px 6px 6px rgba(0,0,0,0.6)">
                                예매 정보
                            </Text>
                            <Text fontSize="lg" className='text-[rgb(211, 211, 211)]'>
                                지역: {region || "-"}
                                <br />
                                영화관: {theater || "-"}
                                <br />
                                날짜: {date || "-"}
                                <br />
                                시간: {time || "-"}
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
                            <Text fontSize="2xl" fontWeight="normal" mb={2}>
                                SEATS
                            </Text>
                            {selectedSeats.length === 0 ? (
                                <Text fontSize="2xl" color="gray.400">
                                선택된 좌석이 없습니다.
                                </Text>
                            ) : (
                                <Text fontSize="2xl" fontWeight="normal" color="#6B46C1">
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
                        <Button
                            mt={6}
                            width="100%"
                            size="2xl"
                            fontSize="2xl"
                            bg={isButtonDisabled ? "gray.600" : "#6B46C1"}
                            color="white"
                            cursor={isButtonDisabled ? "not-allowed" : "pointer"}
                            _hover={isButtonDisabled ? {} : { bg: "#553C9A" }}
                            isDisabled={isButtonDisabled}
                            onClick={() => {
                              if (!isButtonDisabled) {
                                handlePayment();
                                // alert(`결제 진행: 좌석 ${selectedSeats.join(", ")}`);
                              }
                            }}                          
                        >
                            결제하기
                        </Button>
                    </Box>

                    {/* 오른쪽: 좌석 그리드 */}
                <Box flex="3" textAlign="center" overflow="visible">
                <Box 
                    mt="-10%"
                    mb={6} 
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
                        fontWeight="normal"
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
                            fontWeight="normal"
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

                            // const isValidSeat = seatData.some((seat) => seat.fullSeatName === seatId);
                            // if (!isValidSeat) return <Box key={seatId} />;

                            return (
                                <Box
                                    key={seatId}
                                    w="40px"
                                    h="40px"
                                    bg={getSeatColor(seatId)}
                                    // _hover={{ bg: "#6B46C1", cursor: "pointer" }}
                                    _hover={{
                                        bg: !bookedSeats.includes(seatId) &&
                                            !disabledSeats.includes(seatId) &&
                                            !isSelected(seatId)
                                            ? "#6B46C1"
                                            : undefined,
                                        cursor: bookedSeats.includes(seatId) ? "not-allowed" : "pointer"
                                    }}                                    
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
                    {/* 좌석 상태 정보 */}
                    <Flex justify="center" mt={8} gap={6} wrap="wrap">
                        <Flex align="center">
                            <Box w="20px" h="20px" bg="gray.500" borderRadius="md" mr={2} />
                            <Text fontSize="md" color="gray.300">예약 가능</Text>
                        </Flex>
                        <Flex align="center">
                            <Box w="20px" h="20px" bg="gray.300" borderRadius="md" mr={2} />
                            <Text fontSize="md" color="gray.300">예약 완료</Text>
                        </Flex>
                        <Flex align="center">
                            <Box w="20px" h="20px" bg="blue.500" borderRadius="md" mr={2} />
                            <Text fontSize="md" color="gray.300">장애인석</Text>
                        </Flex>
                        <Flex align="center">
                            <Box w="20px" h="20px" bg="#6B46C1" borderRadius="md" mr={2} border="2px solid white" />
                            <Text fontSize="md" color="gray.300">선택한 좌석</Text>
                        </Flex>
                        <Button
                            size="sm"
                            fontSize="sm"
                            color="white"
                            _hover={{bg:"#6B46C1"}}
                            variant="outline"
                            onClick={handleReset}
                            mt={{ base: 4, md: 0 }}
                        >
                            초기화
                        </Button>
                    </Flex>
                </Box>
                </Box>

                </Flex>
            </Box>
        </>
    );
  }