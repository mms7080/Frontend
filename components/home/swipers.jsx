"use client";

import React from "react";
import Slider from "react-slick";
import {IconButton} from "@chakra-ui/react";
import {FaChevronLeft,FaChevronRight} from "react-icons/fa";
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

  return (
    <div style={{ width: "100%", height: "700px", position: "relative",overflow:'visible' }}>
      <Slider {...settings}>
        <div>
          <img
            src="https://cf2.lottecinema.co.kr/lotte_image/2025/Flip/Flip_1920774.png"
            style={{ width: "100%", height: "700px", objectFit: "cover" }}
          />
        </div>
        <div>
          <img
            src="https://cf2.lottecinema.co.kr/lotte_image/2025/Cat/Cat_1920774.jpg"
            style={{ width: "100%", height: "700px", objectFit: "cover" }}
          />
        </div>
        <div>
          <img
            src="https://cf2.lottecinema.co.kr/lotte_image/2025/Secret/Secret_19207745.png"
            style={{ width: "100%", height: "700px", objectFit: "cover" }}
          />
        </div>
      </Slider>
    </div>
  );
}