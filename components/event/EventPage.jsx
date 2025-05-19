"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, Flex, Text, Button } from "@chakra-ui/react";
import { Header, Footer } from "..";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const categories = [
  "전체",
  "추천",
  "메가Pick",
  "영화",
  "극장",
  "제휴/할인",
  "시사회/무대인사",
];

export default function EventPage({ serverEvents }) {
  const [events] = useState(serverEvents || {});
  const [user, setUser] = useState(null);
  const [activeCategory, setActiveCategory] = useState("전체");
  const [searchKeyword, setSearchKeyword] = useState("");
  const router = useRouter();

  useEffect(() => {
    document.title = "진행중인 이벤트 - 필모라";

    (async () => {
      try {
        const userInfoRes = await fetch(
          `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`,
          {
            credentials: "include",
          }
        );

        if (!userInfoRes.ok) {
          throw new Error(`응답 실패: ${userInfoRes.status}`);
        }

        const userInfo = await userInfoRes.json();
        setUser(userInfo);
      } catch (e) {
        console.error("유저 정보 로드 실패:", e);
      }
    })();
  }, []);

  // 날짜 비교용 상태 계산 함수
  const getEventStatus = (dateRange) => {
    const now = new Date();
    const [startStr, endStr] = dateRange
      .split("~")
      .map((s) => s.trim().replace(/\./g, "-"));
    const endDate = new Date(endStr);
    return now > endDate ? "종료됨" : "진행중";
  };

  // 필터링 (카테고리 → 검색)
  const filteredEvents =
    activeCategory === "전체"
      ? Object.entries(events)
      : Object.entries(events).filter(
          ([category]) => category === activeCategory
        );

  const keywordFilteredEvents = filteredEvents
    .map(([category, items]) => {
      const matched = items.filter((event) =>
        event.title.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      return [category, matched];
    })
    .filter(([, matched]) => matched.length > 0);

  return (
    <>
      <Header headerColor="white" headerBg="#1a1a1a" userInfo={user} />

      {/* Swiper Slider */}
      <Box bg="white" pt={20} pb={10} px={6} maxW="1280px" mx="auto">
        <Text
          fontSize="xl"
          fontWeight="bold"
          mb={6}
          borderLeft="4px solid #5f0080"
          pl={2}
        >
          추천 이벤트
        </Text>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={true}
          spaceBetween={30}
          slidesPerView={2}
          onSwiper={(swiper) => {
            swiper.el.addEventListener("mouseenter", () =>
              swiper.autoplay.stop()
            );
            swiper.el.addEventListener("mouseleave", () =>
              swiper.autoplay.start()
            );
          }}
        >
          {(events["추천"] || []).map((event, idx) => (
            <SwiperSlide key={idx}>
              <Box
                bg="white"
                borderRadius="md"
                overflow="hidden"
                boxShadow="md"
                border="1px solid #eee"
                maxW="600px"
                mx="auto"
                onClick={() => router.push(`/event/view/${event.id}`)}
                _hover={{ cursor: "pointer" }}
              >
                <Box w="100%" h="280px" overflow="hidden">
                  <img
                    src={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}${event.image}`}
                    alt={event.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      pointerEvents: "none",
                    }}
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
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      {/* 등록 버튼 */}
      <Box
        bg="white"
        pt={10}
        pb={0}
        px={6}
        maxW="1280px"
        mx="auto"
        display="flex"
        justifyContent="flex-end"
      >
        <Button
          onClick={() => router.push("/event/upload")}
          colorScheme="purple"
          size="sm"
          mb={2}
        >
          + 이벤트 등록
        </Button>
      </Box>

      {/* Category Tabs */}
      <Box bg="white" pt={10} pb={2} px={6} maxW="1280px" mx="auto">
        <Flex gap={2} borderBottom="1px solid #5f0080" flexWrap="wrap">
          {categories.map((category) => (
            <Button
              key={category}
              variant="ghost"
              borderBottom={
                activeCategory === category
                  ? "3px solid #5f0080"
                  : "2px solid transparent"
              }
              borderRadius="0"
              fontWeight={activeCategory === category ? "bold" : "normal"}
              color={activeCategory === category ? "#5f0080" : "black"}
              onClick={() => setActiveCategory(category)}
              _hover={{ bg: "transparent", color: "#5f0080" }}
              fontSize="lg" // 글씨 크기 키우기
              py={4} // 위아래 패딩 키우기
              px={6} // 좌우 패딩 키우기
              minW="120px" // 버튼 너비 확보
              h="50px" // 높이 증가
            >
              {category}
            </Button>
          ))}
        </Flex>

        {/* 🔍 검색창 */}
        <Box mt={4} mb={4}>
          <input
            type="text"
            placeholder="이벤트 제목 검색"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            style={{
              width: "100%",
              maxWidth: "400px",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </Box>
      </Box>

      {/* 기존 이벤트 목록 */}
      <Box bg="white" py={12} px={6} maxW="1280px" mx="auto">
        <Text
          fontSize="2xl"
          fontWeight="bold"
          mb={8}
          borderBottom="2px solid #333"
          pb={2}
        >
          진행중인 이벤트
        </Text>

        {keywordFilteredEvents.map(([category, items]) => (
          <Box key={category} mb={16}>
            <Text
              fontSize="xl"
              fontWeight="bold"
              mt={16}
              mb={4}
              borderLeft="4px solid #5f0080"
              pl={2}
            >
              {category}
            </Text>
            <Flex wrap="wrap" gap={143}>
              {items.map((event, idx) => (
                <Box
                  key={idx}
                  bg="white"
                  borderRadius="md"
                  overflow="hidden"
                  boxShadow="sm"
                  width="200px"
                  transition="0.2s"
                  _hover={{ boxShadow: "xl", transform: "translateY(-5px)" }}
                  border="1px solid #eee"
                  onClick={() => router.push(`/event/view/${event.id}`)}
                  cursor="pointer"
                >
                  <Box w="100%" h="200px" position="relative" overflow="hidden">
                    <img
                      src={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}${event.image}`}
                      alt={event.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        pointerEvents: "none",
                      }}
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
                  <Box p={3}>
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
            </Flex>
          </Box>
        ))}
      </Box>

      <Footer
        footerColor="white"
        footerBg="#1a1a1a"
        footerBorder="transparent"
      />
    </>
  );
}
