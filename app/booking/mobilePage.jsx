"use client";

import React, {useState, useEffect} from 'react';
import { Header } from '../../components';
import { Flex, Box, Text, Button, Image, Wrap, Grid, GridItem, Select } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import Modal, { useModal } from '../../components/movie/modal';

export default function mobilePage() {
    const [movies, setMovies] = useState([]);
    const [regionList, setRegionList] = useState([]);
    const [theaterList, setTheaterList] = useState([]);
    const [availableDates, setAvailableDates] = useState([]);
    const [availableTimes, setAvailableTimes] = useState([]);

    const [swiperReady, setSwiperReady] = useState(false);
    const [user, setUser] = useState(null);
    const [activeMovie, setActiveMovie] = useState(null);
    // const [activeMovie, setSelectedMovie] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedShowtime, setSelectedShowtime] = useState(null);
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [selectedTheater, setSelectedTheater] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const {isModalOpen, isModalVisible, openModal, closeModal, modalContent, onConfirm, onCancel} = useModal();
    
    const router = useRouter();

    const searchParams = useSearchParams();
    const sentmovieid = searchParams.get('id');
    const getRateColor = (rate) => {
        switch (rate) {
            case "ALL": return "green";
            case "12": return "yellow";
            case "15": return "orange";
            case "19": return "red";
            default: return "gray.400";
        }
    };

    let headerColor='white';
    let headerBg='#1a1a1a';

    useEffect(() => {
        setSwiperReady(true);
        document.title = "예매 - FILMORA";
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
        // 영화 데이터
        (async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/movie`);
                if (!res.ok) throw new Error("영화 데이터를 불러오는 데 실패했습니다");
                const movieList = await res.json();
                const baseURL = process.env.NEXT_PUBLIC_SPRING_SERVER_URL;
                const updatedMovieList = movieList.map(movie => ({
                    ...movie,
                    poster: baseURL + movie.poster,
                    wideImage: movie.wideImage ? baseURL + movie.wideImage : null,
                }));
            
                setMovies(updatedMovieList);
                // 초기화면 처음 영화 선택
                if (sentmovieid === null && updatedMovieList.length > 0 && activeMovie === null) {
                  handlePosterClick(updatedMovieList[0]);}
                else if(sentmovieid!==null){
                    for(let index=0;index<updatedMovieList.length;index++){
                        if(updatedMovieList[index].id==sentmovieid){
                            handlePosterClick(updatedMovieList[index]);
                            break;
                        }
                    }
                }
            } catch (err) {
              console.error(err);
            }
        })();      
        // 지역데이터
        (async () => {
            try {
              const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/api/booking/regions`);
              const result = await res.json();
              if (result.success && Array.isArray(result.data)) {
                setRegionList(result.data);
              }
            } catch (e) {
              console.error("지역 데이터 불러오기 실패:", e);
            }
        })();
        // 극장데이터
        (async () => {
            try {
              const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/api/booking/theaters`);
              const result = await res.json();
              if (result.success && Array.isArray(result.data)) {
                setTheaterList(result.data);
              }
            } catch (e) {
              console.error("극장 데이터 불러오기 실패:", e);
            }
        })();
    }, []);

      useEffect(() => {
        if (activeMovie && selectedTheater) {
          const theater = theaterList.find(t => t.name === selectedTheater);
          if (theater) {
            fetchAvailableDates(activeMovie.id, theater.theaterId);
          }
        } else {
          setAvailableDates([]);
        }
      }, [activeMovie, selectedTheater, theaterList]);

      useEffect(() => {
        if (activeMovie && selectedTheater && selectedDate) {
          const theater = theaterList.find(t => t.name === selectedTheater);
          if (theater) {
            fetchAvailableTimes(activeMovie.id, theater.theaterId, selectedDate);
          }
        } else {
          setAvailableTimes([]);
        }
      }, [activeMovie, selectedTheater, selectedDate, theaterList]);
      

      const fetchTheatersByRegion = async (region) => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/api/booking/theaters?region=${encodeURIComponent(region)}`);
          const result = await res.json();
          if (result.success && Array.isArray(result.data)) {
            setTheaterList(result.data); // ✅ 극장 목록 상태 저장
          } else {
            setTheaterList([]);
          }
        } catch (e) {
          console.error("극장 목록 불러오기 실패:", e);
          setTheaterList([]);
        }
      };

      const fetchAvailableDates = async (movieId, theaterId) => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/api/booking/available-dates?movieId=${movieId}&theaterId=${theaterId}`);
          const result = await res.json();
          if (result.success && Array.isArray(result.data)) {
            setAvailableDates(result.data);
          } else {
            setAvailableDates([]);
          }
        } catch (e) {
          console.error("날짜 불러오기 실패:", e);
          setAvailableDates([]);
        }
      };

      const fetchAvailableTimes = async (movieId, theaterId, date) => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/api/booking/showtimes?movieId=${movieId}&theaterId=${theaterId}&date=${date}`);
          const result = await res.json();
          if (result.success && Array.isArray(result.data)) {
            setAvailableTimes(result.data); // ✅ 전체 시간 데이터 저장
          } else {
            setAvailableTimes([]);
          }
        } catch (e) {
          console.error("시간 불러오기 실패:", e);
          setAvailableTimes([]);
        }
      };

    const handleBooking = () => {
        if (!user) {
                                            // 원하는 로그인 페이지 경로로 수정
            openModal("로그인이 필요합니다.", ()=>{router.push("/signin");}, ()=>{router.push("/signin");})
            return;
        }
        // if (!selectedDate || !selectedTime) return;
        if (!selectedDate || !selectedTime || !selectedShowtime) {
          openModal("날짜와 시간을 모두 선택해주세요.");
          return;
      }
        router.push(
            `/booking/seats?movieId=${activeMovie.id}` +
            `&showtimeId=${selectedShowtime.showtimeId}` +
            `&region=${encodeURIComponent(selectedRegion)}` +
            `&theater=${encodeURIComponent(selectedTheater)}` +
            `&date=${encodeURIComponent(selectedDate)}` +
            `&time=${encodeURIComponent(selectedShowtime.startTime.split(" ")[1])}`
        );
    };

    const handlePosterClick = (movie) => {
        setActiveMovie(movie);
        setSelectedDate(null);
        setSelectedTime(null);
        setSelectedShowtime(null);
        setSelectedRegion(null); 
        setSelectedTheater(null); 
    };

    const handleDateClick = (date) => {
      setSelectedDate(date);
      setSelectedTime(null); // 날짜 변경 시 시간 초기화
      setSelectedShowtime(null); // 날짜 변경 시 상영 시간 초기화
    };

    const handleTimeClick = (showtime) => {
      setSelectedTime(showtime.startTime.split(" ")[1]);
      setSelectedShowtime(showtime);
    };
      
      return (
        <>
            
            <Header headerColor={headerColor} headerBg={headerBg} userInfo={user} />
            
            {/* 맨위에 포스터와 제목 */}
            <Box bg="#141414" color="white" py={4}>
            <Flex align="center" px={4} mb={2}>
                {activeMovie && (
                    <Box
                        bg={getRateColor(activeMovie.rate)}
                        color="black"
                        px={2}
                        py="1px"
                        borderRadius="md"
                        fontSize="sm"
                        fontWeight="normal"
                        mr={2}
                        minW="28px"
                        textAlign="center"
                    >
                    {activeMovie.rate}
                    </Box>
                )}
                <Text fontSize="xl" fontWeight="normal">
                    {activeMovie ? activeMovie.title : "현재 상영작"}
                </Text>
            </Flex>
            <Box overflowX="auto" whiteSpace="nowrap" px={4}>
                <Flex>
                    {movies.map((movie, index) => {
                        const isSelected = activeMovie && movie.id === activeMovie.id;
                        return(
                        <Box
                            key={movie.id}
                            minW="100px" // 또는 적절한 최소 너비
                            width="25vw" // 전체 뷰포트의 25%를 차지하도록
                            maxW="150px" // 너무 커지지 않도록 최대 너비 제한
                            height="auto"
                            mr={index !== movies.length - 1 ? 0 : 0} // 마지막 포스터 제외
                            border={isSelected ? '2px solid #6B46C1' : 'none'}
                            borderRadius="md"
                            onClick={() => handlePosterClick(movie)}
                            overflow="hidden"
                            cursor="pointer"
                            p={1}
                            bg={isSelected ? "#2D1F4F" : "transparent"}
                        >
                            <Image
                                src={movie.poster}
                                alt={movie.title}
                                borderRadius="md"
                                width="100%"
                                height="100%"
                                objectFit="cover"
                                loading='lazy'
                            />
                        </Box>)
                    })}
                </Flex>
            </Box>
            </Box>
            {activeMovie && (
                <Box bg="#141414" color="white" py={4} px={4} minH="400px">
                    {/* 지역 선택 */}
                    <Text fontSize="md" mb={1}>REGION</Text>
                    <Box
                    as="select"
                    placeholder="지역을 선택하세요"
                    bg="gray.700"
                    color="white"
                    border="1px solid"
                    borderColor="gray.500"
                    borderRadius="md"
                    p={2}
                    mb={4}
                    width="100%"
                    value={selectedRegion || ''}
                    onChange={(e) => {
                        const region = e.target.value;
                        setSelectedRegion(region);
                        setSelectedTheater(null);
                        fetchTheatersByRegion(region);
                    }}
                    >
                    <option value="" disabled>지역을 선택하세요</option>
                    {regionList.map((region) => (
                        <option key={region} value={region}>{region}</option>
                    ))}
                    </Box>

                    {/* 극장 선택 */}
                    {selectedRegion && (
                    <>
                        <Text fontSize="md" mb={1}>THEATER</Text>
                        <Box
                        as="select"
                        bg="gray.700"
                        color="white"
                        border="1px solid"
                        borderColor="gray.500"
                        borderRadius="md"
                        p={2}
                        mb={4}
                        width="100%"
                        value={selectedTheater || ''}
                        onChange={(e) => setSelectedTheater(e.target.value)}
                        >
                        <option value="" disabled>극장을 선택하세요</option>
                        {theaterList.map((theater) => (
                            <option key={theater.theaterId} value={theater.name}>{theater.name}</option>
                        ))}
                        </Box>
                    </>
                    )}
                    {/* 날짜 선택 */}
                    {selectedTheater && availableDates.length > 0 && (
                        <>
                            <Text fontSize="md" mb={1}>DATE</Text>
                            <Box overflowX="auto" whiteSpace="nowrap" mb={4}>
                                <Flex>
                                    {availableDates.map((date) => (
                                        <Button
                                            key={date}
                                            onClick={() => handleDateClick(date)}
                                            bg={selectedDate === date ? "#6B46C1" : "gray.700"}
                                            color="white"
                                            border="1px solid"
                                            borderColor={selectedDate === date ? "#6B46C1" : "gray.500"}
                                            borderRadius="md"
                                            p={2}
                                            mr={2}
                                            minW="70px"
                                        >
                                            {new Date(date).getMonth() + 1}/{new Date(date).getDate()}
                                        </Button>
                                    ))}
                                </Flex>
                            </Box>
                        </>
                    )}

                    {/* 시간 선택 */}
                    {selectedDate && availableTimes.length > 0 && (
                        <>
                            <Text fontSize="md" mb={1}>TIME</Text>
                            <Grid templateColumns="repeat(3, 1fr)" gap={3} mb={6}>
                                {availableTimes.map((showtime) => {
                                    const time = showtime.startTime.split(" ")[1];
                                    const isSelected = selectedShowtime && selectedShowtime.showtimeId === showtime.showtimeId;
                                    const now = new Date(); // 현재 시간
                                    const movieTime = new Date(showtime.startTime.replace(" ", "T")); // ISO 형식으로 변환
                                    let enabled=movieTime > now; // 현재보다 후이면 true
                                    return (
                                        <GridItem key={showtime.showtimeId}>
                                            <Button
                                                width="100%"
                                                bg={isSelected ? "#6B46C1" : "gray.700"}
                                                color="white"
                                                border="1px solid"
                                                borderColor={isSelected ? "#6B46C1" : "gray.500"}
                                                borderRadius="md"
                                                p={2}
                                                onClick={() => handleTimeClick(showtime)}
                                                disabled={!enabled}
                                            >
                                                <Text>{time}</Text>
                                                <Text fontSize="sm" color="gray.400">{showtime.auditoriumName}</Text>
                                            </Button>
                                        </GridItem>
                                    );
                                })}
                            </Grid>
                        </>
                    )}

                    {/* 예매하기 버튼 */}
                    <Button
                        width="100%"
                        bg={selectedDate && selectedTime ? "#6B46C1" : "gray.600"}
                        color="white"
                        size="lg"
                        isDisabled={!selectedDate || !selectedTime}
                        onClick={handleBooking}
                    >
                        예매하기
                    </Button>
                </Box>
            )}
        {isModalOpen && (<Modal
        isModalOpen={isModalOpen}
        isModalVisible={isModalVisible}
        closeModal={closeModal}
        onConfirm={onConfirm}
        onCancel={onCancel}
        content={modalContent}/>)}
        </>
    );
}
