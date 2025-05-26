"use client";

import React, {useState, useEffect} from 'react';
import { Flex, Box, Text, Button, Image, Wrap } from '@chakra-ui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, EffectCoverflow, Autoplay } from 'swiper/modules';
import { Header, Footer } from '../../components';
import MoviePoster,{movies} from '../../components/moviePoster';
import { useRouter } from 'next/navigation';
import DateSelector from '../../components/date';
import TimeSelector from '../../components/time';
import { theaterList } from '../../components/theaterList';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-coverflow';
import 'swiper/css/autoplay';

export default function Booking2Page() {
    const [user, setUser] = useState(null);
    const [activeMovie, setActiveMovie] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [selectedTheater, setSelectedTheater] = useState(null);
    const router = useRouter();

    let headerColor='white';
    let headerBg='#1a1a1a';
    let footerColor='white';
    let footerBg='#1a1a1a';
    let footerBorder='transparent';

    useEffect(() => {
        document.title = '예매 - 빠른 예매';
        (async ()=>{
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);
                setUser(res);
            } catch (e) {}
        })();
    }, []);

    const handleBooking = () => {
        if (!selectedDate || !selectedTime) return;
        router.push(
        `/reserve?movieId=${activeMovie.id}` +
        `&date=${encodeURIComponent(selectedDate)}` +
        `&time=${encodeURIComponent(selectedTime)}`
        );
    };

    const handlePosterClick = (movie) => {
        setActiveMovie(movie);
        setSelectedDate(null);
        setSelectedTime(null);
        setSelectedRegion(null); 
        setSelectedTheater(null); 
    };

    return (
    <>
        <Box position="relative" zIndex={2} bg="#1a1a1a">
            <Header headerColor={headerColor} headerBg={headerBg} userInfo={user}/>
        </Box>

        <Box textAlign="left" ml="10%" mt="20px">
            <Text fontSize="5xl" color="white">
            빠른예매
            </Text>
            <Box w="160px" h="4px" bg="purple" mt="2" />
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
                background: purple; /* 활성 점 색상 (보라 핑크) */
            }
            `}</style>
            <Box maxW="1550px" w="100%" px={4}>
            <Swiper
                modules={[Navigation, Pagination, Scrollbar, A11y, EffectCoverflow, Autoplay]}
                effect="coverflow"
                grabCursor
                centeredSlides
                speed={700}
                slidesPerView={3}
                spaceBetween={0}
                coverflowEffect={{ rotate: 0, stretch: 50, depth: 200, modifier: 1, slideShadows: true }}
                pagination={{ clickable: true }}
                navigation
                loop
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true
                }}
                style={{ paddingBottom: '60px' }}
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
            </Box>
        </Flex>

        <Box position="relative" zIndex={2} bg="#1a1a1a">
            <Footer footerColor={footerColor} footerBg={footerBg} footerBorder={footerBorder} />
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
                <Box position="absolute" top={0} left={0} width="100%" height="100%" bg="rgba(0,0,0,0.6)" />
                <Box 
                position="relative" 
                mx="auto" 
                p={6} 
                borderRadius="md" 
                maxW="80%" 
                w="80%" 
                color="white"
                bgImage={`url(${activeMovie.backdropUrl || activeMovie.poster})`}
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
                        filter="blur(50px)"
                        borderRadius="md"
                        zIndex={1}
                    />
                    <Box position="relative" zIndex={2}>
                    <Flex justify="space-between" align="center" mb={4}>
                    <Text fontSize="5xl">{activeMovie.title}</Text>
                    <Button fontSize="2xl" color="white" variant="ghost" colorScheme="whiteAlpha" _hover={{ bg: 'purple' }} onClick={() => setActiveMovie(null)}> X </Button>
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
                            bg="rgba(0, 0, 0, 0.6)"
                            borderRadius="lg"
                            p={4}
                            display="flex"
                            flexDirection="column"
                            color="white"
                            >
                            {/* 지역 선택 버튼들 */}
                            <Box mb={4}>
                                <Text fontSize="lg" mb={2}>REGION</Text>
                                <Wrap spacing={2}>
                                {Object.keys(theaterList).map((region) => (
                                    <Button
                                    key={region}
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        setSelectedRegion(region);
                                        setSelectedTheater(null);
                                    }}
                                    bg={selectedRegion === region ? 'purple' : 'transparent'}
                                    color={selectedRegion === region ? 'white' : 'gray.300'}
                                    borderColor="transparent"
                                    _hover={{ bg: 'purple', color: 'white' }}
                                    >
                                    {region}
                                    </Button>
                                ))}
                                </Wrap>
                            </Box>

                            {/* 극장 목록 */}
                            <Box flex="1" overflowY="auto" minH={0}>
                                <Text fontSize="lg" mb={2}>THEATERS</Text>
                                {selectedRegion && theaterList[selectedRegion].map((theater) => (
                                <Button
                                    key={theater}
                                    onClick={() => setSelectedTheater(theater)}
                                    variant="outline"
                                    color={selectedTheater === theater ? 'white' : 'gray.300'}
                                    bg={selectedTheater === theater ? 'purple' : 'transparent'}
                                    borderColor="transparent"
                                    _hover={{ bg: 'purple', color: 'white' }}
                                    w="100%"
                                    mb={2}
                                >
                                    {theater}
                                </Button>
                                ))}
                            </Box>
                            </Box>


                        {/* 날짜/시간 선택 박스 */}
                        <Box
                            width="700px"
                            height="650px"
                            bg="rgba(0, 0, 0, 0.6)"
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
                                <Text fontSize="xl" mb={2}>DATE</Text>
                                {selectedTheater ? (
                                <DateSelector
                                    selectedDate={selectedDate}
                                    setSelectedDate={(date) => {
                                    setSelectedDate(date);
                                    setSelectedTime(null); // 날짜 바꾸면 시간 초기화
                                    }}
                                    selectedTheater={selectedTheater}
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
                                minW="0" overflow="
                                auto"
                                css={{
                                    scrollbarWidth: 'none',          // Firefox
                                    '&::-webkit-scrollbar': {
                                    display: 'none',               // Chrome, Safari
                                    },
                                }}
                            >
                            <Text fontSize="xl" mb={2}>TIME</Text>
                            {selectedTheater && selectedDate ? (
                                <TimeSelector
                                    selectedTime={selectedTime}
                                    setSelectedTime={setSelectedTime}
                                    movieTitle={activeMovie?.title}
                                />
                                ) : (
                                <Text fontSize="md" color="gray.300" mt={4}>
                                    먼저 영화관과 날짜를 선택해주세요.
                                </Text>
                                )}
                            <Box flex="1" />
                            {/* 좌석 선택 버튼 */}
                            {selectedTheater && selectedDate && selectedTime ? (
                                // 🎯 조건이 모두 만족되었을 때: 활성 버튼
                                <Button
                                    mt="auto"
                                    width="100%" 
                                    size="lg"
                                    onClick={handleBooking}
                                    sx={{
                                    bg: 'transparent',
                                    color: 'white',
                                    border: '1px solid white',
                                    _hover: { bg: 'purple', color: 'white' }
                                    }}
                                >
                                    좌석선택하기
                                </Button>
                                ) : (
                                // ❌ 조건이 하나라도 빠졌을 때: 비활성화 버튼
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

                            {/* <Button
                                mt="auto"
                                width="100%" 
                                size="lg"
                                onClick={handleBooking}
                                isDisabled={!selectedDate || !selectedTime}
                                css={{
                                  // 기본 버튼 스타일
                                  bg: (!selectedDate || !selectedTime) ? 'gray.500' : 'transparent',
                                  color: (!selectedDate || !selectedTime) ? 'white' : 'white',
                                  border: '1px solid',
                                  borderColor: 'white',
                                  cursor: (!selectedDate || !selectedTime) ? 'not-allowed' : 'pointer',
                                  _hover: (!selectedDate || !selectedTime)
                                    ? {} // 비활성화일 땐 hover 없음
                                    : { bg: 'purple', color: 'white' },
                                  _disabled: {
                                    bg: 'gray.500',
                                    color: 'white',
                                    cursor: 'not-allowed',
                                    _hover: {},  // hover 효과 제거
                                  },
                                }}
                            >
                                좌석선택하기
                            </Button> */}
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