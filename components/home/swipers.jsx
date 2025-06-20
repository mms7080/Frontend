"use client";

import React,{useState,useRef} from "react";
import Slider from "react-slick";
import {IconButton,Image,Box,useMediaQuery} from "@chakra-ui/react";
import {FaChevronLeft,FaChevronRight} from "react-icons/fa";
import Modal,{useModal} from '../movie/modal';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// 커스텀 화살표 컴포넌트
function NextArrow(props) {
  const { onClick } = props;
  return (
    <IconButton
      aria-label="Next"
      position="absolute"
      right="10px"
      top="45%"
      transform="translateY(-50%)"
      zIndex="2"
      backgroundColor="transparent"
      onClick={onClick}
      outline='none'
      border='none'
      
    ><FaChevronRight color='white' _hover={{color:'gray.300'}}/></IconButton>
  );
}

function PrevArrow(props) {
  const { onClick } = props;
  return (
    <IconButton
      aria-label="Previous"
      position="absolute"
      left="10px"
      top="45%"
      transform="translateY(-50%)"
      zIndex="2"
      backgroundColor="transparent"
      onClick={onClick}
      outline='none'
      border='none'
    ><FaChevronLeft color='white' _hover={{color:'gray.300'}}/></IconButton>
  );
}

export default function SimpleSlider() {

  const [isMobile] = useMediaQuery("(max-width: 768px)");

  const trailer=[
    '<iframe width="920" height="517.5" src="https://www.youtube.com/embed/o8j70yHzTJs?si=jFYHzDscX0JHpvnk&autoplay=1&mute=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
    '<iframe width="920" height="517.5" src="https://www.youtube.com/embed/IHrSrP_9Afw?si=t9isfICIT6DtDmzH&autoplay=1&mute=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
    '<iframe width="920" height="517.5" src="https://www.youtube.com/embed/6c3I-gNUUJw?si=nDGKZIeK_2Un04kM&autoplay=1&mute=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>'
  ]

  const mobiletrailer=[
    "https://www.youtube.com/embed/o8j70yHzTJs?si=jFYHzDscX0JHpvnk&autoplay=1&mute=1",
    "https://www.youtube.com/embed/IHrSrP_9Afw?si=t9isfICIT6DtDmzH&autoplay=1&mute=1",
    "https://www.youtube.com/embed/6c3I-gNUUJw?si=nDGKZIeK_2Un04kM&autoplay=1&mute=1"
  ]

  const {isModalOpen, isModalVisible, openModal, closeModal} = useModal();
  const [trailerContent,setTrailerContent]= useState(trailer[0]);
  const settings = {
    dots: false,   
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const downPosition = useRef({ x: 0, y: 0 });
  const handleMouseDown = (e) => {
    downPosition.current = { x: e.clientX, y: e.clientY };
  };
  const handleMouseUp1 = (e) => {
    const deltaX = Math.abs(e.clientX - downPosition.current.x);
    const deltaY = Math.abs(e.clientY - downPosition.current.y);

    if (deltaX < 5 && deltaY < 5) {
      setTrailerContent(trailer[0]);
      if(!isMobile)openModal();
      else window.open(mobiletrailer[0], "_blank");
    }
  };
  const handleMouseUp2 = (e) => {
    const deltaX = Math.abs(e.clientX - downPosition.current.x);
    const deltaY = Math.abs(e.clientY - downPosition.current.y);

    if (deltaX < 5 && deltaY < 5) {
      setTrailerContent(trailer[1]);
      if(!isMobile)openModal();
      else window.open(mobiletrailer[1], "_blank");
    }
  };
  const handleMouseUp3 = (e) => {
    const deltaX = Math.abs(e.clientX - downPosition.current.x);
    const deltaY = Math.abs(e.clientY - downPosition.current.y);

    if (deltaX < 5 && deltaY < 5) {
      setTrailerContent(trailer[2]);
      if(!isMobile)openModal();
      else window.open(mobiletrailer[2], "_blank");
    }
  };

  return (
    <Box w="100%" h={{base:"200px",md:"700px"}} position="relative" overflow='visible'>
      <Slider {...settings}>
        <div>
          <Image
            src={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/images/homeswipers1.png`}
            w='100%'
            h={{base:"200px",md:"700px"}}
            objectFit='cover'
            loading="lazy"
            _hover={{cursor:'pointer'}}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp1}
            outline='none'
          />
        </div>
        <div>
          <Image
            src={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/images/homeswipers2.jpg`}
            w='100%'
            h={{base:"200px",md:"700px"}}
            objectFit='cover'
            loading="lazy"
            _hover={{cursor:'pointer'}}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp2}
            outline='none'
          />
        </div>
        <div>
          <Image
            src={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/images/homeswipers3.png`}
            w='100%'
            h={{base:"200px",md:"700px"}}
            objectFit='cover'
            loading="lazy"
            _hover={{cursor:'pointer'}}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp3}
            outline='none'
          />
        </div>
      </Slider>
      {isModalOpen && (<Modal
      isModalOpen={isModalOpen}
      isModalVisible={isModalVisible}
      closeModal={closeModal}
      isVideo={true}
      content={trailerContent}/>)}

    </Box>
  );
}