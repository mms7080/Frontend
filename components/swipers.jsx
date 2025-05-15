"use client";
import {VStack,Image,IconButton} from '@chakra-ui/react';

import {Swiper,SwiperSlide} from 'swiper/react';
import {Navigation,Pagination,Autoplay} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {FaCaretLeft,FaCaretRight} from 'react-icons/fa';

export default function Swipers(){
    return <VStack w='100%' h='700px' position='relative'>
            {/* 왼쪽 화살표 */}
            <IconButton
                className="swiper-button-prev"
                position="absolute"
                top="50%"
                left="10px"
                transform="translateY(-50%)"
                zIndex="2"
                icon={<FaCaretLeft size={30} />}
                aria-label="Previous Slide"
                backgroundColor="transparent"
                color='white'
                _hover={{ backgroundColor: 'transparent', color: 'gray.300' }}
            />

            {/* 오른쪽 화살표 */}
            <IconButton
                className="swiper-button-next"
                position="absolute"
                top="50%"
                right="10px"
                transform="translateY(-50%)"
                zIndex="2"
                icon={<FaCaretRight size={30} />}
                aria-label="Next Slide"
                backgroundColor="transparent"
                color='white'
                _hover={{ backgroundColor: 'transparent', color: 'gray.300' }}
            />

            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
                }}
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000 }}
                loop={true}
                spaceBetween={1}
                slidesPerView={1}
                style={{width:'100%',height:'100%'}}
            >
                <SwiperSlide>
                    <Image objectFit='cover' style={{width:'100%',height:'100%'}} src="https://cf2.lottecinema.co.kr/lotte_image/2025/Flip/Flip_1920774.png" />
                </SwiperSlide>
                <SwiperSlide>
                    <Image objectFit='cover' style={{width:'100%',height:'100%'}} src="https://cf2.lottecinema.co.kr/lotte_image/2025/Cat/Cat_1920774.jpg" />
                </SwiperSlide>
                <SwiperSlide>
                    <Image objectFit='cover' style={{width:'100%',height:'100%'}} src="https://cf2.lottecinema.co.kr/lotte_image/2025/Secret/Secret_19207745.png" />
                </SwiperSlide>
            </Swiper>
        </VStack>;
}