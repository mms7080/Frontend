"use client";

import React, {useState, useEffect} from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, EffectCoverflow, Autoplay } from 'swiper/modules';
import { Header, Footer } from '../../components';
import MoviePoster,{movies} from '../../components/moviePoster';
import DateSelector from '../../components/date';
import TimeSelector from '../../components/time';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-coverflow';

export default function Booking2Page() {
    const [user, setUser] = useState(null);

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

  return (
    <>
        <Box position="relative" zIndex={2} bg="#1a1a1a">
            <Header headerColor={headerColor} headerBg={headerBg} userInfo={user}/>
        </Box>

        {/* <Text fontSize="5xl" color="black" textAlign="left" marginLeft="10%" marginTop="20px">
            빠른예매
        </Text> */}
        <Box textAlign="left" ml="10%" mt="20px">
            <Text fontSize="5xl" color="black">
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
                color: purple; /* 원하는 화살표 색상 (보라 핑크 계열) */
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
                    />
                </SwiperSlide>
                ))}
            </Swiper>
            </Box>
        </Flex>
        <Box position="relative" zIndex={2} bg="#1a1a1a">
            <Footer footerColor={footerColor} footerBg={footerBg} footerBorder={footerBorder} />
        </Box>
    </>
  );
}
