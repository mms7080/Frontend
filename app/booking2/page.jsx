"use client";

import React, {useState, useEffect} from 'react';
import { Flex, Box, Text, Button, Image } from '@chakra-ui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, EffectCoverflow, Autoplay } from 'swiper/modules';
import { Header, Footer } from '../../components';
import MoviePoster,{movies} from '../../components/moviePoster';
// import DateSelector from '../../components/date';
// import TimeSelector from '../../components/time';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-coverflow';
import 'swiper/css/autoplay';

export default function Booking2Page() {
    const [user, setUser] = useState(null);
    const [activeMovie, setActiveMovie] = useState(null);

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

    const handlePosterClick = (movie) => {
        setActiveMovie(movie);
      };
      const closeModal = () => setActiveMovie(null);

    return (
    <>
        {/* 헤더 */}
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
                filter: brightness(70%);
            }
            /* Navigation arrows color */
            .swiper-button-next,
            .swiper-button-prev {
                color: purple; /* 화살표색 -> 보라색으로 변경 */
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
                speed={800}
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
        {/* 푸터 */}
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
                // bgImage={`url(${activeMovie.poster})`}
                bgSize="cover"
                bgPosition="center"
                filter="blur(20px)"
                transform="scale(1.1)"
            />

            <Box position="absolute" top={0} left={0} width="100%" height="100%" bg="rgba(0,0,0,0.6)" />

            <Box 
            // position="relative" 
            // mx="auto" 
            // p={6} 
            // bg="#2d2d2d" 
            // // filter="blur(20px)"
            // borderRadius="md" 
            // maxW="80%" w="80%" 
            // color="white"
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
                <Button fontSize="2xl" color="white" variant="ghost" colorScheme="whiteAlpha" _hover={{ bg: 'purple' }} onClick={() => setActiveMovie(null)}>X</Button>
                </Flex>
                <Image
                src={activeMovie.poster}
                alt={activeMovie.title}
                borderRadius="8px"
                mb={4}
                width="400px"
                height="650px"
                objectFit="cover"
                />
                <Text fontSize="md">{activeMovie.description}</Text>
            </Box>
            </Box>
            </Box>
        )}
    </>
  );
}
