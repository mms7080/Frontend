"use client";

import React, {useState, useEffect} from 'react';
import { Flex, Box, Text, Button, Image, Wrap, Grid, GridItem } from '@chakra-ui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, EffectCoverflow, Autoplay } from 'swiper/modules';
import { Header } from '../../components';
import { useRouter } from 'next/navigation';
import DateSelector from '../../components/date';
import TimeSelector from '../../components/time';
import {FaHeart} from 'react-icons/fa';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-coverflow';
import 'swiper/css/autoplay';

export default function Booking2Page() {
    const [movies, setMovies] = useState([]);
    const [regionList, setRegionList] = useState([]);
    const [theaterList, setTheaterList] = useState([]);
    const [availableDates, setAvailableDates] = useState([]);
    const [availableTimes, setAvailableTimes] = useState([]);

    const [swiperReady, setSwiperReady] = useState(false);
    const [user, setUser] = useState(null);
    const [activeMovie, setActiveMovie] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedShowtime, setSelectedShowtime] = useState(null);
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [selectedTheater, setSelectedTheater] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const router = useRouter();

    let headerColor='white';
    let headerBg='#1a1a1a';

    useEffect(() => {
        setSwiperReady(true);
        document.title = "예매 - 영화선택";
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
      }, [activeMovie, selectedTheater]);

      useEffect(() => {
        if (activeMovie && selectedTheater && selectedDate) {
          const theater = theaterList.find(t => t.name === selectedTheater);
          if (theater) {
            fetchAvailableTimes(activeMovie.id, theater.theaterId, selectedDate);
          }
        } else {
          setAvailableTimes([]);
        }
      }, [activeMovie, selectedTheater, selectedDate]);
      

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
          const res = await fetch(`http://localhost:9999/api/booking/available-dates?movieId=${movieId}&theaterId=${theaterId}`);
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
            alert("로그인 후 예매를 진행할 수 있습니다.");
            router.push("/signin"); // 원하는 로그인 페이지 경로로 수정
            return;
        }
        if (!selectedDate || !selectedTime) return;
        router.push(
            `/booking/seats?movieId=${activeMovie.id}` +
            `&showtimeId=${selectedShowtime.showtimeId}` +
            `&region=${encodeURIComponent(selectedRegion)}` +
            `&theater=${encodeURIComponent(selectedTheater)}` +
            `&date=${encodeURIComponent(selectedDate)}` +
            `&time=${encodeURIComponent(selectedShowtime.startTime.split(" ")[1])}`
            // `&time=${encodeURIComponent(selectedTime)}` 
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

    return (
    <>
        <Box position="relative" zIndex={2} bg="#1a1a1a">
            <Header headerColor={headerColor} headerBg={headerBg} userInfo={user}/>
        </Box>

        <Flex flex="1" align="center" justify="center" pt="5vh">
            <style jsx global>{`
                .swiper-slide:not(.swiper-slide-active) img {
                    filter: brightness(50%);
                }
                /* Navigation arrows color */
                .swiper-button-next,
                .swiper-button-prev {
                    color: white; /* 화살표색 -> 보라색으로 변경 */
                }
                /* Pagination bullets */
                .swiper-pagination-bullet {
                    background: #ccc; /* 비활성 점 색상 */
                    opacity: 1;
                }
                .swiper-pagination-bullet-active {
                    background: #6B46C1; /* 활성 점 색상 (보라 핑크) */
                }
            `}</style>
            <Box maxW="1550px" w="100%" px={4}>
                {swiperReady && movies.length > 0 && (
                <Swiper
                    modules={[Navigation, Pagination, Scrollbar, A11y, EffectCoverflow, Autoplay]}
                    effect="coverflow"
                    grabCursor
                    centeredSlides
                    speed={700}
                    slidesPerView={3}
                    spaceBetween={0}
                    loop
                    loopAdditionalSlides={1}
                    coverflowEffect={{ rotate: 0, stretch: 50, depth: 0, scale: 0.8, modifier: 1, slideShadows: true }}
                    pagination={{ clickable: true }}
                    navigation
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true
                    }}
                    style={{ paddingBottom: '60px' }}
                    onSlideChange={(swiper) => {
                        setActiveIndex(swiper.realIndex);
                    }}
                >
                    {movies.map(movie => (
                    <SwiperSlide
                        key={movie.id}
                        style={{ width: '350px', height: '650px', display: 'flex', justifyContent: 'center' }}
                    >
                        <img
                            src={movie.poster}
                            alt={movie.title}
                            style={{ width: '100%', height: '100%', borderRadius: '12px', objectFit: 'cover' }}
                            onClick={() => handlePosterClick(movie)}
                        />
                    </SwiperSlide>
                    ))}
                </Swiper>
                )}
            </Box>
        </Flex>
        <Box
            mt={8}
            mb={20}
            px={20}
            py={20}
            maxW="80%"
            w="100%"
            mx="auto"
            bg="rgba(0, 0, 0, 0.2)"
            borderRadius="lg"
            color="white"
        >
            <Flex justify="space-between" align="start" gap={8}>
                {/* 왼쪽: 포스터 */}
                <Box flex="1" display="flex" justifyContent="center">
                    <Image
                        src={movies[activeIndex]?.poster}
                        alt={movies[activeIndex]?.title}
                        w="80%"
                        margin="50px"
                        borderRadius="md"
                        objectFit="cover"
                        boxShadow="0px 0px 30px rgba(255,255,255,0.6)"
                    />
                </Box>

                {/* 가운데: 정보 */}
                <Box flex="1" textAlign="center" flexDirection="column" justifyContent="space-between" minH="320px" mt={10}>
                    <Text fontSize="5xl" fontWeight="normal" mt={0} mb={3} textAlign="left" textShadow="6px 6px 6px rgba(0,0,0,0.6)">
                        {movies[activeIndex]?.title || ''}
                    </Text>
                    <Text fontSize="2xl" mb={10} textAlign="left" textShadow="6px 6px 6px rgba(0,0,0,0.6)">{movies[activeIndex]?.titleEnglish || ''}</Text>
                    <Flex align="center" gap={2} mb={1}>
                        <Button fontSize="2xl" mb={20} _hover={{cursor:"default"}} boxShadow="6px 6px 6px rgba(0,0,0,0.6)">
                            <FaHeart color="red" />
                            {movies[activeIndex]?.likeNumber || '0'}
                        </Button>
                    </Flex>
                    <Box mt={8}>
                        <Grid templateColumns="repeat(3, 1fr)" gap={8}>
                            {/* 각 항목 */}
                            <GridItem>
                                <Text fontSize="2xl" fontWeight="normal" textAlign="left" textShadow="6px 6px 6px rgba(0,0,0,0.6)">실관람 평점</Text>
                                <Text fontSize="xl" mt={1} textAlign="left" textShadow="6px 6px 6px rgba(0,0,0,0.6)">🎬 {movies[activeIndex]?.score || '-'}</Text>
                            </GridItem>
                            <GridItem>
                                <Text fontSize="2xl" fontWeight="normal" textAlign="left" textShadow="6px 6px 6px rgba(0,0,0,0.6)">예매율</Text>
                                <Text fontSize="xl" mt={1} textAlign="left" textShadow="6px 6px 6px rgba(0,0,0,0.6)">{movies[activeIndex]?.reserveRate || '-'}%</Text>
                            </GridItem>
                            <GridItem>
                                <Text fontSize="2xl" fontWeight="normal" textAlign="left" textShadow="6px 6px 6px rgba(0,0,0,0.6)">누적관객수</Text>
                                <Text fontSize="xl" mt={1} textAlign="left" textShadow="6px 6px 6px rgba(0,0,0,0.6)">👥 {movies[activeIndex]?.totalView || '-'}만명</Text>
                            </GridItem>
                        </Grid>
                    </Box>
                </Box>

                <Box w="1px" bg="#6B46C1" height="460px" mx={4} mt={10} />

                {/* 오른쪽: 비어 있음 (공간 확보) */}
                <Box flex="1" mt={10}>
                    <Box mb={5}>
                        <Text fontWeight="normal" fontSize="lg" mb={1} textShadow="6px 6px 6px rgba(0,0,0,0.6)">상영시간</Text>
                        <Text fontSize="md" color="gray.400">{movies[activeIndex]?.runningTime || '-'}분</Text>
                    </Box>
                    <Box mb={5}>
                        <Text fontWeight="normal" fontSize="lg" mb={1} textShadow="6px 6px 6px rgba(0,0,0,0.6)">개봉일</Text>
                        <Text fontSize="md" color="gray.400">{movies[activeIndex]?.releaseDate || '-'}</Text>
                    </Box>
                    <Box mb={5}>
                        <Text fontWeight="normal" fontSize="lg" mb={1} textShadow="6px 6px 6px rgba(0,0,0,0.6)">장르</Text>
                        <Text fontSize="md" color="gray.400">{movies[activeIndex]?.genre || '-'}</Text>
                    </Box>
                    <Box mb={5}>
                        <Text fontWeight="normal" fontSize="lg" mb={1} textShadow="6px 6px 6px rgba(0,0,0,0.6)">감독</Text>
                        <Text fontSize="md" color="gray.400">{movies[activeIndex]?.director || '-'}</Text>
                    </Box>
                    <Box mb={5}>
                        <Text fontWeight="normal" fontSize="lg" mb={1} textShadow="6px 6px 6px rgba(0,0,0,0.6)">출연</Text>
                        <Text fontSize="md" color="gray.400">{movies[activeIndex]?.cast || '-'}</Text>
                    </Box>
                    <Box>
                        <Text fontWeight="normal" fontSize="lg" mb={1} textShadow="6px 6px 6px rgba(0,0,0,0.6)">관람등급</Text>
                        <Text fontSize="md" color="gray.400">{movies[activeIndex]?.rate || '-'}</Text>
                    </Box>
                </Box>
            </Flex>
        </Box>

        {activeMovie && (
            <Box position="fixed" top={0} left={0} width="100vw" height="100vh" zIndex={1000} display="flex" alignItems="center" justifyContent="center">
                <Box
                    position="absolute"
                    top={0}
                    left={0}
                    width="100%"
                    height="100%"
                    color="black"
                    bgSize="cover"
                    bgPosition="center"
                    transform="scale(1.1)"
                />
                <Box position="absolute" top={0} left={0} width="100%" height="100%" bg="rgba(0,0,0,0.8)" onClick={() => setActiveMovie(null)} />
                <Box 
                    position="relative" 
                    mx="auto" 
                    p={6} 
                    borderRadius="md" 
                    maxW="90%" 
                    w="100%" 
                    color="white"
                    bgImage={`url(${activeMovie.backdropUrl || activeMovie.wideImage})`}
                    bgSize="cover"
                    bgPosition="center"
                >
                    <Box
                        position="absolute"
                        top={0}
                        left={0}
                        width="100%"
                        height="100%"
                        bg="rgba(0,0,0,0.7)"  // 투명도 조절해서 어둡기 강도 변경
                        borderRadius="md"
                        zIndex={1}
                        onClick={(e) => e.stopPropagation()}
                    />
                    <Box position="relative" zIndex={2}>
                    <Flex justify="space-between" align="center" mb={4} ml="7.5%">
                        <Text fontSize="5xl">{activeMovie.title}</Text>
                        <Button fontSize="2xl" color="white" variant="ghost" colorScheme="whiteAlpha" _hover={{ bg: '#6B46C1' }} onClick={() => setActiveMovie(null)}> X </Button>
                    </Flex>
                    <Flex direction="row" justify="center" align="start" gap={10}>
                        {/* 포스터 */}
                        <Image
                            src={activeMovie.poster}
                            alt={activeMovie.title}
                            borderRadius="8px"
                            mb={4}
                            width="400px"
                            height="650px"
                            objectFit="cover"
                        />
                        {/* 극장 선택 박스 */}
                        <Box
                            width="250px"
                            height="650px"
                            bg="rgba(0, 0, 0, 0.95)"
                            borderRadius="lg"
                            p={4}
                            display="flex"
                            flexDirection="column"
                            color="white"
                            >
                            {/* 지역 선택 버튼들 */}
                            <Box mb={4}>
                                <Text fontSize="2xl" fontWeight="normal" mb={2} >REGION</Text>
                                <Wrap spacing={2}>
                                    {regionList.map((region) => (
                                        <Button
                                            key={region}
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                setSelectedRegion(region);
                                                setSelectedTheater(null);
                                                fetchTheatersByRegion(region);
                                            }}
                                            bg={selectedRegion === region ? '#6B46C1' : 'transparent'}
                                            color={selectedRegion === region ? 'white' : 'gray.300'}
                                            borderColor="transparent"
                                            border={selectedRegion === region ? '1px solid white' : 'transparent'}
                                            _hover={{ bg: '#6B46C1', color: 'white' }}
                                        >
                                            {region}
                                        </Button>
                                    ))}
                                </Wrap>
                            </Box>

                            {/* 극장 목록 */}
                            <Box flex="1" overflowY="auto" minH={0}>
                                <Text fontSize="2xl" fontWeight="normal" mb={2}>THEATERS</Text>
                                {theaterList.map((theater) => (
                                    <Button
                                    key={theater.theaterId}
                                    onClick={() => {
                                        setSelectedTheater(theater.name);
                                        setSelectedDate(null);
                                        setSelectedTime(null);
                                    }}
                                    variant="outline"
                                    color={selectedTheater === theater.name ? 'white' : 'gray.300'}
                                    bg={selectedTheater === theater.name ? '#6B46C1' : 'transparent'}
                                    borderColor="transparent"
                                    border={selectedTheater === theater.name ? '1px solid white' : 'transparent'}
                                    _hover={{ bg: '#6B46C1', color: 'white' }}
                                    w="100%"
                                    mb={2}
                                    >
                                    {theater.name}
                                    </Button>
                                ))}
                                </Box>
                            </Box>

                        {/* 날짜/시간 선택 박스 */}
                        <Box
                            width="700px"
                            height="650px"
                            bg="rgba(0, 0, 0, 0.95)"
                            borderRadius="lg"
                            p={6}
                            display="flex"
                            flexDirection="row"
                            gap={4}
                        >
                            {/* 날짜 선택 (40%) */}
                            <Box 
                                flex="2" 
                                minW="0" 
                                overflow="auto"
                                css={{
                                    scrollbarWidth: 'none',
                                    '&::-webkit-scrollbar': {
                                    display: 'none',
                                    },
                                }}
                            >
                                <Text fontSize="2xl" fontWeight="normal" mb={2}>DATE</Text>
                                {selectedTheater ? (
                                <DateSelector
                                    selectedDate={selectedDate}
                                    setSelectedDate={(date) => {
                                        setSelectedDate(date);
                                        setSelectedTime(null); // 날짜 바꾸면 시간 초기화
                                    }}
                                    availableDates={availableDates}
                                />
                                ) : (
                                <Text fontSize="md" color="gray.300" mt={4}>
                                    영화관을 선택하세요.
                                </Text>
                                )}
                            </Box>

                            {/* 시간 선택 (60%) */}
                            <Box 
                                flex="3" 
                                display="flex" 
                                flexDirection="column" 
                                minW="0" 
                                overflow="auto"
                                css={{
                                    scrollbarWidth: 'none',          // Firefox
                                    '&::-webkit-scrollbar': {
                                    display: 'none',               // Chrome, Safari
                                    },
                                }}
                            >
                            <Text fontSize="2xl" fontWeight="normal" mb={2}>TIME</Text>
                            {selectedTheater && selectedDate ? (
                                <TimeSelector
                                    selectedShowtime={selectedShowtime}
                                    onSelectShowtime={(showtime) => {
                                        setSelectedShowtime(showtime);
                                        setSelectedTime(showtime.startTime.split(" ")[1]);
                                    }}
                                    movieTitle={activeMovie?.title}
                                    availableTimes={availableTimes}
                                />
                                // <TimeSelector
                                //     selectedTime={selectedTime}
                                //     setSelectedTime={setSelectedTime}
                                //     movieTitle={activeMovie?.title}
                                //     availableTimes={availableTimes}
                                // />
                                ) : (
                                <Text fontSize="md" color="gray.300" mt={4}>
                                    날짜를 선택하세요.
                                </Text>
                                )}
                            <Box flex="1" />
                            {/* 좌석 선택 버튼 */}
                            {selectedTheater && selectedDate && selectedTime ? (
                                // 활성 버튼
                                <Button
                                    mt="auto"
                                    width="100%" 
                                    size="lg"
                                    onClick={handleBooking}
                                    css={{
                                    bg: 'transparent',
                                    color: 'white',
                                    border: '1px solid white',
                                    _hover: { bg: '#6B46C1', color: 'white' }
                                    }}
                                >
                                    좌석선택하기
                                </Button>
                                ) : (
                                // 비활성화 버튼
                                <Button
                                    mt="auto"
                                    width="100%" 
                                    size="lg"
                                    isDisabled
                                    bg="gray.500"
                                    color="white"
                                    cursor="not-allowed"
                                    _hover={{}}  // 호버 시 변화 없음
                                >
                                    좌석선택하기
                                </Button>
                                )}
                            </Box>
                        </Box>
                    </Flex>
                </Box>
                </Box>
            </Box>
        )}
    </>
  );
}