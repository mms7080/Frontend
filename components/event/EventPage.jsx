"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, Flex, Text, Button, Image, SimpleGrid } from "@chakra-ui/react";
import { Header, Footer } from "..";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const categories = [
  "전체",
  "Pick",
  "영화",
  "극장",
  "제휴/할인",
  "시사회/무대인사",
];
const categoryOrder = ["Pick", "영화", "극장", "제휴/할인", "시사회/무대인사"];

export default function EventPage({ serverEvents }) {
  const [events] = useState(serverEvents || {});
  const [user, setUser] = useState(null);
  const [activeCategory, setActiveCategory] = useState("전체");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [confirmedKeyword, setConfirmedKeyword] = useState("");
  const router = useRouter();

  useEffect(() => {
    document.title = "진행중인 이벤트 - 필모라";

    (async () => {
      try {
        const userInfoRes = await fetch(
          `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`,
          { credentials: "include" }
        );
        if (!userInfoRes.ok) throw new Error();
        const userInfo = await userInfoRes.json();
        setUser(userInfo);
      } catch (e) {
        console.error("유저 정보 로드 실패:", e);
      }
    })();
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
        e.title.toLowerCase().includes(confirmedKeyword.toLowerCase())
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
        <Text
          fontSize="24px"
          fontWeight="normal"
          color="#222"
          borderBottom="2px solid #ccc"
          pb="12px"
          mb="40px"
        >
          📅 이벤트
        </Text>
      </Box>

      <Box
        bg="white"
        pt={20}
        pb={75}
        px={{ base: 4, md: 6 }}
        maxW="1280px"
        mx="auto"
      >
        {user?.auth === "ADMIN" && (
          <Flex justify="flex-end" mb={4}>
            <Button
              colorScheme="purple"
              onClick={() => router.push("/event/upload")}
            >
              + 이벤트 등록
            </Button>
          </Flex>
        )}

        <Text
          fontSize="xl"
          fontWeight="bold"
          mb={6}
          borderLeft="4px solid #6B46C1"
          pl={2}
        >
          추천 이벤트
        </Text>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 2000, disableOnInteraction: false }}
          loop
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{ 640: { slidesPerView: 1 }, 768: { slidesPerView: 2 } }}
          onSwiper={(swiper) => {
            swiper.el.addEventListener("mouseenter", () =>
              swiper.autoplay.stop()
            );
            swiper.el.addEventListener("mouseleave", () =>
              swiper.autoplay.start()
            );
          }}
        >
          {(events["Pick"] || []).map((event, idx) => (
            <SwiperSlide key={idx}>
              <Box
                bg="white"
                borderRadius="md"
                overflow="hidden"
                boxShadow="md"
                border="1px solid #eee"
                maxW="400px"
                mx="auto"
                marginBottom="10%"
                onClick={() => router.push(`/event/view/${event.id}`)}
                _hover={{ cursor: "pointer" }}
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
            onKeyDown={(e) =>
              e.key === "Enter" && setConfirmedKeyword(searchKeyword)
            }
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
            onClick={() => setConfirmedKeyword(searchKeyword)}
            px={6}
            fontWeight="normal"
          >
            검색
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
              columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
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

      <Footer
        footerColor="white"
        footerBg="#1a1a1a"
        footerBorder="transparent"
      />
    </>
  );
}
