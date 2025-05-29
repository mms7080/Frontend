"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Flex, Box, Text, Button, Image, Wrap, Spinner } from '@chakra-ui/react'; // Spinner 추가
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, EffectCoverflow, Autoplay } from 'swiper/modules';
import { Header, Footer } from '../../components';
import MoviePoster, { movies as staticMovies } from '../../components/moviePoster'; // 초기 영화 목록은 정적으로 유지하거나 API로 대체 가능
import { useRouter } from 'next/navigation';
import DateSelector from '../../components/date';
import TimeSelector from '../../components/time';
// import { theaterList as staticTheaterList } from '../../components/theaterList'; // 정적 데이터 제거

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-coverflow';
import 'swiper/css/autoplay';

export default function BookingTestPage() {
    const [swiperReady, setSwiperReady] = useState(false);
    const [user, setUser] = useState(null);
    const [activeMovie, setActiveMovie] = useState(null); // 선택된 영화
    const [selectedDate, setSelectedDate] = useState(null); // 선택된 날짜 (YYYY-MM-DD)
    const [selectedTime, setSelectedTime] = useState(null); // 선택된 시간 (HH:MM)
    const [selectedRegion, setSelectedRegion] = useState(null); // 선택된 지역명
    const [selectedTheater, setSelectedTheater] = useState(null); // 선택된 영화관 객체 {id, name}
    const [activeIndex, setActiveIndex] = useState(0);
    const router = useRouter();

    // API 데이터 상태
    const [regions, setRegions] = useState([]); // 지역 목록
    const [theatersByRegion, setTheatersByRegion] = useState([]); // 선택된 지역의 영화관 목록
    const [showtimes, setShowtimes] = useState([]); // 선택된 조건의 상영 시간표
    const [availableSeatsForShowtime, setAvailableSeatsForShowtime] = useState(0); // 선택된 시간의 잔여 좌석 (필요 시)

    // 로딩 상태
    const [loadingRegions, setLoadingRegions] = useState(false);
    const [loadingTheaters, setLoadingTheaters] = useState(false);
    const [loadingShowtimes, setLoadingShowtimes] = useState(false);

    let headerColor = 'white';
    let headerBg = '#1a1a1a';
    let footerColor = 'white';
    let footerBg = '#1a1a1a';
    let footerBorder = 'transparent';

    const API_BASE_URL = process.env.NEXT_PUBLIC_SPRING_SERVER_URL;

    // 사용자 정보 가져오기
    useEffect(() => {
        setSwiperReady(true);
        document.title = "예매 - 빠른 예매";
        (async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/userinfo`, { credentials: "include" });
                if (!res.ok) throw new Error();
                const data = await res.json();
                setUser(data);
            } catch (e) {
                setUser(null);
            }
        })();
    }, [API_BASE_URL]);

    // 지역 목록 가져오기 (최초 1회)
    useEffect(() => {
        const fetchRegions = async () => {
            setLoadingRegions(true);
            try {
                const res = await fetch(`${API_BASE_URL}/api/booking/regions`, { credentials: "include" });
                if (!res.ok) throw new Error('Failed to fetch regions');
                const data = await res.json();
                setRegions(data);
            } catch (error) {
                console.error("Error fetching regions:", error);
                setRegions([]); // 에러 시 빈 배열로 설정
            } finally {
                setLoadingRegions(false);
            }
        };
        fetchRegions();
    }, [API_BASE_URL]);

    // 선택된 지역에 따른 영화관 목록 가져오기
    useEffect(() => {
        if (!selectedRegion) {
            setTheatersByRegion([]);
            return;
        }
        const fetchTheaters = async () => {
            setLoadingTheaters(true);
            try {
                const res = await fetch(`${API_BASE_URL}/api/booking/theaters?region=${encodeURIComponent(selectedRegion)}`, { credentials: "include" });
                if (!res.ok) throw new Error('Failed to fetch theaters');
                const data = await res.json();
                setTheatersByRegion(data);
            } catch (error) {
                console.error("Error fetching theaters:", error);
                setTheatersByRegion([]);
            } finally {
                setLoadingTheaters(false);
            }
        };
        fetchTheaters();
    }, [selectedRegion, API_BASE_URL]);

    // 영화, 영화관, 날짜 선택에 따른 상영 시간표 가져오기
    // useCallback으로 불필요한 재실행 방지
    const fetchShowtimes = useCallback(async () => {
        if (!activeMovie || !selectedTheater || !selectedDate) {
            setShowtimes([]);
            return;
        }
        setLoadingShowtimes(true);
        try {
            const res = await fetch(
                `${API_BASE_URL}/api/booking/showtimes?theaterId=${selectedTheater.id}&movieId=${activeMovie.id}&date=${selectedDate}`,
                { credentials: "include" }
            );
            if (!res.ok) throw new Error('Failed to fetch showtimes');
            const data = await res.json();
            setShowtimes(data);
        } catch (error) {
            console.error("Error fetching showtimes:", error);
            setShowtimes([]);
        } finally {
            setLoadingShowtimes(false);
        }
    }, [activeMovie, selectedTheater, selectedDate, API_BASE_URL]);

    useEffect(() => {
        fetchShowtimes();
    }, [fetchShowtimes]);


    const handleBooking = () => {
        if (!activeMovie || !selectedTheater || !selectedDate || !selectedTime) {
            alert("모든 항목을 선택해주세요.");
            return;
        }
        // 선택된 showtimeId 찾기
        const selectedShowtime = showtimes.find(st => st.startTime === selectedTime);
        if (!selectedShowtime) {
            alert("선택한 시간에 해당하는 상영 정보가 없습니다.");
            return;
        }

        // 예매 페이지로 이동 (showtimeId, 영화제목, 영화관이름, 날짜, 시간 전달)
        router.push(
            `/reserve?showtimeId=${selectedShowtime.id}` +
            `&movieTitle=${encodeURIComponent(activeMovie.title)}` +
            `&theaterName=${encodeURIComponent(selectedTheater.name)}`+
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
        setShowtimes([]);
    };
    
    // 현재 영화 목록은 staticMovies를 사용합니다. 필요시 API로 교체할 수 있습니다.
    const currentMovies = staticMovies; 

    return (
        <>
            <Box position="relative" zIndex={2} bg="#1a1a1a">
                <Header headerColor={headerColor} headerBg={headerBg} userInfo={user} />
            </Box>

            <Flex flex="1" align="center" justify="center" pt="5vh">
                {/* Swiper 스타일 */}
                <style jsx global>{`
                .swiper-slide:not(.swiper-slide-active) img {
                    filter: brightness(50%);
                }
                .swiper-button-next,
                .swiper-button-prev {
                    color: white;
                }
                .swiper-pagination-bullet {
                    background: #ccc;
                    opacity: 1;
                }
                .swiper-pagination-bullet-active {
                    background: #6B46C1;
                }
                `}</style>
                <Box maxW="1550px" w="100%" px={4}>
                    {swiperReady && (
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
                            coverflowEffect={{ rotate: 0, stretch: 50, depth: 200, modifier: 1, slideShadows: true }}
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
                                // 스와이퍼 영화 변경시 activeMovie 업데이트 (선택사항)
                                // handlePosterClick(currentMovies[swiper.realIndex]);
                            }}
                        >
                            {currentMovies.map(movie => (
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
                bg="rgba(0, 0, 0, 0.7)"
                borderRadius="lg"
                color="white"
            >
                <Flex align="center" gap={6}>
                    <Image
                        src={currentMovies[activeIndex]?.poster}
                        alt={currentMovies[activeIndex]?.title}
                        w="25%"
                        borderRadius="md"
                        objectFit="cover"
                    />
                    <Text fontSize="3xl" fontWeight="bold">
                        {currentMovies[activeIndex]?.title || ''}
                    </Text>
                </Flex>
            </Box>

            <Box position="relative" zIndex={2} bg="#1a1a1a">
                <Footer footerColor={footerColor} footerBg={footerBg} footerBorder={footerBorder} />
            </Box>

            {activeMovie && (
                <Box position="fixed" top={0} left={0} width="100vw" height="100vh" zIndex={1000} display="flex" alignItems="center" justifyContent="center">
                    {/* 배경 블러 처리 */}
                    <Box
                        position="absolute"
                        top={0}
                        left={0}
                        width="100%"
                        height="100%"
                        bgImage={`url(${activeMovie.backdropUrl || activeMovie.poster})`}
                        bgSize="cover"
                        bgPosition="center"
                        filter="blur(20px)" // 블러 강도 조절
                        transform="scale(1.1)" // 가장자리 흐림 현상 방지
                    />
                    <Box position="absolute" top={0} left={0} width="100%" height="100%" bg="rgba(0,0,0,0.7)" /> {/* 어두운 오버레이 */}
                    
                    <Box
                        position="relative"
                        mx="auto"
                        p={6}
                        borderRadius="md"
                        maxW="90%"
                        w="auto" // 너비를 콘텐츠에 맞게 조절
                        color="white"
                        // bg="rgba(0,0,0,0.85)" // 내부 컨텐츠 배경색 (필요시 투명도 조절)
                        // boxShadow="xl" // 그림자 효과
                    >
                        <Flex justify="space-between" align="center" mb={4}>
                            <Text fontSize="5xl">{activeMovie.title}</Text>
                            <Button fontSize="2xl" color="white" variant="ghost" colorScheme="whiteAlpha" _hover={{ bg: '#6B46C1' }} onClick={() => setActiveMovie(null)}> X </Button>
                        </Flex>
                        <Flex direction={{base: "column", md: "row"}} justify="center" align="start" gap={10}>
                            <Image
                                src={activeMovie.poster}
                                alt={activeMovie.title}
                                borderRadius="8px"
                                mb={4}
                                width="350px" // 포스터 크기 고정 또는 반응형 조절
                                height="525px" // 높이도 비율에 맞게
                                objectFit="cover"
                            />
                            <Box
                                width="250px"
                                height="525px" // 포스터 높이에 맞춤
                                bg="rgba(0, 0, 0, 0.85)"
                                borderRadius="lg"
                                p={4}
                                display="flex"
                                flexDirection="column"
                                color="white"
                            >
                                <Box mb={4}>
                                    <Text fontSize="lg" mb={2}>REGION</Text>
                                    {loadingRegions ? <Spinner size="md" /> : (
                                        <Wrap spacing={2}>
                                            {regions.map((region) => (
                                                <Button
                                                    key={region}
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setSelectedRegion(region);
                                                        setSelectedTheater(null); // 지역 변경 시 영화관 초기화
                                                        setSelectedDate(null);
                                                        setSelectedTime(null);
                                                        setShowtimes([]);
                                                    }}
                                                    bg={selectedRegion === region ? '#6B46C1' : 'transparent'}
                                                    color={selectedRegion === region ? 'white' : 'gray.300'}
                                                    borderColor="transparent"
                                                    _hover={{ bg: '#6B46C1', color: 'white' }}
                                                >
                                                    {region}
                                                </Button>
                                            ))}
                                        </Wrap>
                                    )}
                                </Box>

                                <Box flex="1" overflowY="auto" minH={0}>
                                    <Text fontSize="lg" mb={2}>THEATERS</Text>
                                    {loadingTheaters ? <Spinner size="md" /> : (
                                        selectedRegion && theatersByRegion.map((theater) => (
                                            <Button
                                                key={theater.id} // theater.id 사용
                                                onClick={() => {
                                                    setSelectedTheater(theater); // theater 객체 전체 저장
                                                    setSelectedDate(null);
                                                    setSelectedTime(null);
                                                    setShowtimes([]);
                                                }}
                                                variant="outline"
                                                color={selectedTheater?.id === theater.id ? 'white' : 'gray.300'}
                                                bg={selectedTheater?.id === theater.id ? '#6B46C1' : 'transparent'}
                                                borderColor="transparent"
                                                _hover={{ bg: '#6B46C1', color: 'white' }}
                                                w="100%"
                                                mb={2}
                                            >
                                                {theater.name} 
                                            </Button>
                                        ))
                                    )}
                                    {!selectedRegion && <Text fontSize="sm" color="gray.400">지역을 선택하세요.</Text>}
                                    {selectedRegion && theatersByRegion.length === 0 && !loadingTheaters && <Text fontSize="sm" color="gray.400">해당 지역에 영화관이 없습니다.</Text>}
                                </Box>
                            </Box>

                            <Box
                                width="700px"
                                height="525px" // 포스터 높이에 맞춤
                                bg="rgba(0, 0, 0, 0.85)"
                                borderRadius="lg"
                                p={6}
                                display="flex"
                                flexDirection="row"
                                gap={4}
                            >
                                <Box
                                    flex="2"
                                    minW="0"
                                    overflowY="auto" // 스크롤바 항상 표시 (내용 넘칠 때만)
                                    css={{ /* 스크롤바 스타일 (선택사항) */
                                        '&::-webkit-scrollbar': { width: '8px' },
                                        '&::-webkit-scrollbar-track': { background: 'rgba(255,255,255,0.1)' },
                                        '&::-webkit-scrollbar-thumb': { background: '#6B46C1', borderRadius: '4px' }
                                    }}
                                >
                                    <Text fontSize="xl" mb={2}>DATE</Text>
                                    {selectedTheater ? (
                                        <DateSelector
                                            selectedDate={selectedDate}
                                            setSelectedDate={(date) => {
                                                setSelectedDate(date);
                                                setSelectedTime(null); // 날짜 바꾸면 시간 초기화
                                                setShowtimes([]);
                                            }}
                                            // selectedTheater={selectedTheater} // DateSelector가 자체 날짜를 생성하므로 불필요할 수 있음
                                        />
                                    ) : (
                                        <Text fontSize="md" color="gray.300" mt={4}>
                                            영화관을 선택하세요.
                                        </Text>
                                    )}
                                </Box>

                                <Box
                                    flex="3"
                                    display="flex"
                                    flexDirection="column"
                                    minW="0"
                                    overflowY="auto"
                                    css={{ /* 스크롤바 스타일 */
                                        '&::-webkit-scrollbar': { width: '8px' },
                                        '&::-webkit-scrollbar-track': { background: 'rgba(255,255,255,0.1)' },
                                        '&::-webkit-scrollbar-thumb': { background: '#6B46C1', borderRadius: '4px' }
                                    }}
                                >
                                    <Text fontSize="xl" mb={2}>TIME</Text>
                                    {loadingShowtimes ? <Spinner size="md" /> : (
                                        selectedTheater && selectedDate ? (
                                            showtimes.length > 0 ? (
                                                // TimeSelector 대신 직접 시간 버튼 렌더링
                                                <Wrap spacing={3} direction="column" w="100%">
                                                    {showtimes.map((st) => (
                                                        <Button
                                                            key={st.id} // st.id 사용
                                                            onClick={() => {
                                                                setSelectedTime(st.startTime);
                                                                setAvailableSeatsForShowtime(st.availableSeats);
                                                            }}
                                                            variant="outline"
                                                            bg={selectedTime === st.startTime ? '#6B46C1' : 'transparent'}
                                                            color={selectedTime === st.startTime ? 'white' : 'gray.200'}
                                                            borderColor={selectedTime === st.startTime ? 'white' : 'transparent'}
                                                            _hover={{ bg: '#6B46C1', color: 'white' }}
                                                            w="100%"
                                                            h="auto" // 높이 자동 조절
                                                            py={3} // 상하 패딩
                                                            fontSize="md" // 폰트 크기 조절
                                                            justifyContent="space-between" // 내부 요소 정렬
                                                            isDisabled={st.availableSeats === 0} // 잔여 좌석 없을 시 비활성화
                                                        >
                                                            <Flex w="100%" align="center" justify="space-between">
                                                                <Text fontWeight="bold">{st.startTime}</Text>
                                                                <Text fontSize="sm" color={st.availableSeats > 0 ? "green.300" : "red.300"}>
                                                                    {st.availableSeats > 0 ? `${st.availableSeats}석` : "매진"}
                                                                </Text>
                                                            </Flex>
                                                            <Text fontSize="xs" w="100%" textAlign="left" mt={1}>{st.screenType} {st.screenName}</Text>
                                                        </Button>
                                                    ))}
                                                </Wrap>
                                            ) : (
                                                <Text fontSize="md" color="gray.300" mt={4}>
                                                    선택하신 날짜에 상영 정보가 없습니다.
                                                </Text>
                                            )
                                        ) : (
                                            <Text fontSize="md" color="gray.300" mt={4}>
                                                날짜를 선택하세요.
                                            </Text>
                                        )
                                    )}
                                    <Box flex="1" />
                                    {selectedTheater && selectedDate && selectedTime ? (
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
                                        <Button
                                            mt="auto"
                                            width="100%"
                                            size="lg"
                                            isDisabled
                                            bg="gray.500"
                                            color="white"
                                            cursor="not-allowed"
                                            _hover={{}}
                                        >
                                            좌석선택하기
                                        </Button>
                                    )}
                                </Box>
                            </Box>
                        </Flex>
                    </Box>
                </Box>
            )}
        </>
    );
}
