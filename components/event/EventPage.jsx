"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, Flex, Text, Button, Image, SimpleGrid, IconButton } from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Header } from "..";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Modal, { useModal } from '../movie/modal';

const categories = [
  "전체",
  "Pick",
  "영화",
  "극장",
  "제휴/할인",
  "시사회/무대인사",
];
const categoryOrder = ["Pick", "영화", "극장", "제휴/할인", "시사회/무대인사"];

// 커스텀 화살표 컴포넌트
function NextArrow(props) {
  const { onClick } = props;
  return (
    <IconButton
      aria-label="Next"
      position="absolute"
      bottom="50%"
      right="5px"
      transform="translateY(-50%)"
      zIndex="2"
      backgroundColor="transparent"
      onClick={onClick}
      outline='none'
      border='none'
      
    ><FaChevronRight color='gray' _hover={{color:'gray.300'}}/></IconButton>
  );
}

function PrevArrow(props) {
  const { onClick } = props;
  return (
    <IconButton
      aria-label="Previous"
      position="absolute"
      bottom="50%"
      left="5px"
      transform="translateY(-50%)"
      zIndex="2"
      backgroundColor="transparent"
      onClick={onClick}
      outline='none'
      border='none'
    ><FaChevronLeft color='gray' _hover={{color:'gray.300'}}/></IconButton>
  );
}

export default function EventPage({ serverEvents, userData }) {
  const [events] = useState(serverEvents || {});
  const [user, setUser] = useState(userData);
  const [activeCategory, setActiveCategory] = useState("전체");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [confirmedKeyword, setConfirmedKeyword] = useState("");
  const {isModalOpen, isModalVisible, openModal, closeModal, modalContent} = useModal();
  const router = useRouter();

  useEffect(() => {
    document.title = "이벤트 - FILMORA";
  }, []);

  const getEventStatus = (dateRange) => {
    const now = new Date();
    const [_, endStr] = dateRange
      .split("~")
      .map((s) => s.trim().replace(/\./g, "-"));
    const endDate = new Date(endStr);
    return now > endDate ? "종료됨" : "진행중";
  };

  const filteredEvents =
    activeCategory === "전체"
      ? categoryOrder
          .filter((cat) => events[cat])
          .map((cat) => [cat, events[cat]])
      : Object.entries(events).filter(
          ([category]) => category === activeCategory
        );

  const keywordFilteredEvents = filteredEvents
    .map(([category, items]) => [
      category,
      items.filter((e) =>
        [e.title, e.date, e.category].some((v) =>
              v?.replace(/\s+/g, '').toLowerCase().includes(confirmedKeyword.replace(/\s+/g, '').toLowerCase())
            )
      ),
    ])
    .filter(([_, items]) => items.length > 0);

  return (
    <>
      <Header headerColor="white" headerBg="#1a1a1a" userInfo={user} />

      <Box
        maxW="1200px"
        mx="auto"
        pt="80px"
        pb="40px"
        px="16px"
        textAlign="center"
      >
<h1
  style={{
    fontSize: "24px",
    fontWeight: "normal",
    color: "#222",
    borderBottom: "2px solid #ccc",
    paddingBottom: "12px",
    marginBottom: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
  }}
>
  <img
    src="http://localhost:9999/images/logo.png" 
    alt="logo"
    style={{ width: "141px", height: "68px", objectFit: "contain" }}
    loading='lazy'
  />
</h1>
      </Box>

      <Box
        bg="white"
        px={{ base: 4, md: 6 }}
        maxW="1280px"
        mx="auto"
      >
        {user?.auth === "ADMIN" && (
          <Flex justify="flex-end" mb={4}>
            <Button
              colorScheme="purple"
              onClick={() => router.push("/event/upload")}
              style={{ transform: "translateX(-30px)" }}
            >
              + 이벤트 등록
            </Button>
          </Flex>
        )}
<Box
  bg="white"
  border="1px solid #ddd"
  borderRadius="16px"
  boxShadow="0 8px 16px rgba(107, 70, 193, 0.2)"
  p={6}
  textAlign="center"
  mb={10}
  maxW="1280px"
  mx="auto"
  position="relative"
  overflow="hidden"
>
  {/* 상단 라벨 */}
  <Box
    position="absolute"
    top="0"
    left="0"
    bg="#6B46C1"
    color="white"
    px={4}
    py={2}
    fontSize="sm"
    fontWeight="bold"
    borderBottomRightRadius="12px"
  >
    스페셜 이벤트
  </Box>

  {/* 타이틀 */}
  <Text fontSize="2xl" fontWeight="bold" mb={3} color="#6B46C1">
    🎁 1,000원 상품권 랜덤 뽑기
  </Text>

  {/* 이미지 */}
  <Box mb={5}>
    <Image
      src="http://localhost:9999/images/coupon.png" // 이미지 경로는 원하는 것으로 교체
      alt="₩1,000 쿠폰 이미지"
      mx="auto"
      borderRadius="12px"
      boxShadow="md"
      maxW="150px"
      loading='lazy'
    />
  </Box>

  {/* 설명 */}
  <Text fontSize="sm" color="#555" mb={5}>
    오늘의 행운을 테스트해보세요! 단 하루, 단 한 번의 찬스!
  </Text>

  {/* 버튼 */}
  <Button
    backgroundColor="#6B46C1"
    color="white"
    fontWeight="semibold"
    borderRadius="8px"
    px={6}
    py={3}
    fontSize="md"
    transition="all 0.3s"
    _hover={{ bg: "#553C9A", transform: "scale(1.05)" }}
    onClick={() => {
      if(userData)router.push("/RandomBoxPage");
      else openModal('로그인이 필요합니다.');
    }}
  >
    지금 뽑기
  </Button>
</Box>






        <Text
          fontSize="xl"
          fontWeight="bold"
          mb={6}
          borderLeft="4px solid #6B46C1"
          pl={2}
        >
          추천 이벤트
        </Text>
        <Box w="100%" maxW="1280px" mx="auto" px={{ base: 4, md: 6 }}>
          <Slider
            dots={true}
            infinite={true}
            speed={500}
            slidesToShow={3}
            slidesToScroll={1}
            autoplay={true}
            autoplaySpeed={2000}
            pauseOnHover={true}
            arrows={true}
            nextArrow={<NextArrow />}
            prevArrow={<PrevArrow />}
            responsive={[
              {
                breakpoint: 768,
                settings: {
                  slidesToShow: 1,
                },
              },
            ]}
          >
            {(events["Pick"] || []).map((event, idx) => (
              <Box
                key={idx}
                p={2}
                w="100%"
                maxW="400px"
                mx="auto"
                onClick={() => router.push(`/event/view/${event.id}`)}
                _hover={{ cursor: "pointer" }}
              >
                <Box
                  border="1px solid #eee"
                  borderRadius="md"
                  overflow="hidden"
                  boxShadow="md"
                >
                  <Box w="100%" h="400px" overflow="hidden">
                    <img
                      src={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}${event.image}`}
                      alt={event.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        pointerEvents: "none",
                      }}
                      loading='lazy'
                    />
                  </Box>
                  <Box p={4} position="relative">
                    <Text
                      position="absolute"
                      top="8px"
                      right="8px"
                      fontSize="xs"
                      fontWeight="bold"
                      color="white"
                      bg={
                        getEventStatus(event.date) === "종료됨"
                          ? "gray.500"
                          : "green.500"
                      }
                      px={2}
                      py={0.5}
                      borderRadius="full"
                    >
                      {getEventStatus(event.date)}
                    </Text>
                    <Text fontSize="lg" fontWeight="bold" mb={2}>
                      {event.title}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {event.date}
                    </Text>
                  </Box>
                </Box>
              </Box>
            ))}
          </Slider>
        </Box>
      </Box>

      <Box bg="white" py={12} px={{ base: 4, md: 6 }} maxW="1280px" mx="auto">
        <Text
          fontSize="2xl"
          fontWeight="bold"
          mb={8}
          borderBottom="2px solid #333"
          pb={2}
        >
          진행중인 이벤트
        </Text>

        <Box mt={4} mb={8} display="flex" gap={2} flexWrap="wrap">
          <input
            type="text"
            placeholder="이벤트 검색"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={(e) =>{
              if(e.key === "Enter"){
                if(searchKeyword.replace(/\s+/g, '')===''){
                  openModal('유효한 검색어를 입력해주세요!');
                  return;
                }
                setConfirmedKeyword(searchKeyword);
              }
            }}
            style={{
              width: "100%",
              maxWidth: "300px",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
          <Button
            colorScheme="purple"
            onClick={() => {
              if(searchKeyword.replace(/\s+/g, '')===''){
                  openModal('유효한 검색어를 입력해주세요!');
                  return;
              }
              setConfirmedKeyword(searchKeyword);
            }}
            px={6}
            fontWeight="normal"
          >
            검색
          </Button>

          <Button
            colorScheme="purple"
            onClick={() => {
              setConfirmedKeyword('');
            }}
            px={6}
            fontWeight="normal"
          >
          전체보기
          </Button>
        </Box>

        <Flex gap={2} borderBottom="1px solid #6B46C1" flexWrap="wrap" mb={10}>
          {categories.map((category) => (
            <Button
              key={category}
              variant="ghost"
              borderBottom={
                activeCategory === category
                  ? "3px solid #6B46C1"
                  : "2px solid transparent"
              }
              borderRadius="0"
              fontWeight={activeCategory === category ? "bold" : "normal"}
              color={activeCategory === category ? "#6B46C1" : "black"}
              onClick={() => setActiveCategory(category)}
              _hover={{ bg: "transparent", color: "#6B46C1" }}
              fontSize="lg"
              py={4}
              px={6}
              minW="120px"
              h="50px"
            >
              {category}
            </Button>
          ))}
        </Flex>
        {keywordFilteredEvents.length === 0 && (
          <Text fontSize="lg" color="gray.500" textAlign="center" mt={20}>
            검색 결과가 없습니다.
          </Text>
        )}

        {keywordFilteredEvents.map(([category, items]) => (
          <Box key={category} mb={16}>
            <Text
              fontSize="xl"
              fontWeight="bold"
              mt={16}
              mb={4}
              borderLeft="4px solid #6B46C1"
              pl={2}
            >
              {category}
            </Text>
            <SimpleGrid
              columns={{ base: 2, sm: 2, md: 3, lg: 4 }}
              spacing={6}
              justifyItems="center"
            >
              {items.map((event, idx) => (
                <Box
                  key={idx}
                  bg="white"
                  borderRadius="md"
                  overflow="hidden"
                  boxShadow="sm"
                  width="100%"
                  maxW="243px"
                  transition="0.2s"
                  _hover={{ boxShadow: "xl", transform: "translateY(-5px)" }}
                  border="1px solid #eee"
                  onClick={() => router.push(`/event/view/${event.id}`)}
                  cursor="pointer"
                >
                  <Box w="100%" h="243px" position="relative" overflow="hidden">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}${event.image}`}
                      alt={event.title}
                      w="100%"
                      h="100%"
                      objectFit="cover"
                      loading='lazy'
                    />
                    <Text
                      position="absolute"
                      top="8px"
                      right="8px"
                      fontSize="xs"
                      fontWeight="bold"
                      color="white"
                      bg={
                        getEventStatus(event.date) === "종료됨"
                          ? "gray.600"
                          : "green.500"
                      }
                      px={2}
                      py={0.5}
                      borderRadius="full"
                      zIndex={2}
                    >
                      {getEventStatus(event.date)}
                    </Text>
                  </Box>
                  <Box p={3} minH="80px">
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                      mb={1}
                      noOfLines={2}
                    >
                      {event.title}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {event.date}
                    </Text>
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        ))}
      </Box>
      {isModalOpen && (<Modal
      isModalOpen={isModalOpen}
      isModalVisible={isModalVisible}
      closeModal={closeModal}
      content={modalContent}/>)}
    </>
  );
}
