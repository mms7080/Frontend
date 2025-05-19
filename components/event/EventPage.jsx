'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Box, Flex, Text, Button } from '@chakra-ui/react';
import { Header,Footer } from '..';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const categories = ['전체','추천','메가Pick', '영화', '극장', '제휴/할인', '시사회/무대인사'];

export default function EventPage({ serverEvents }) {
  const [events] = useState(serverEvents || {});
  const [user, setUser] = useState(null);
  const [activeCategory, setActiveCategory] = useState('전체');
  const router = useRouter();

  useEffect(() => {
    document.title = '진행중인 이벤트 - 필모라';

    (async () => {
      try {
        const userInfoRes = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`, {
          credentials: 'include',
        });

        if (!userInfoRes.ok) {
          throw new Error(`응답 실패: ${userInfoRes.status}`);
        }

        const userInfo = await userInfoRes.json();
        setUser(userInfo);
      } catch (e) {
        console.error('유저 정보 로드 실패:', e);
      }
    })();
  }, []);

  const filteredEvents = activeCategory === '전체'
    ? Object.entries(events)
    : Object.entries(events).filter(([category]) => category === activeCategory);

  return (
    <>
      <Header headerColor="white" headerBg="#1a1a1a" userInfo={user} />

      {/* Swiper Slider */}
      <Box bg="white" pt={20} pb={10} px={6} maxW="1280px" mx="auto">
        <Text fontSize="xl" fontWeight="bold" mb={6} borderLeft="4px solid #5f0080" pl={2}>
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
        >
          {(events['추천'] || []).map((event, idx) => (
            <SwiperSlide key={idx}>
              <Box
                bg="white"
                borderRadius="md"
                overflow="hidden"
                boxShadow="md"
                border="1px solid #eee"
                maxW="600px"
                mx="auto"
              >
                <Box w="100%" h="280px" overflow="hidden">
                  <img
                    src={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}${event.image}`}
                    alt={event.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
                <Box p={4}>
                  <Text fontSize="lg" fontWeight="bold" mb={2}>{event.title}</Text>
                  <Text fontSize="sm" color="gray.500">{event.date}</Text>
                </Box>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

         
      <Box bg="white" pt={10} pb={0} px={6} maxW="1280px" mx="auto" display="flex" justifyContent="flex-end">
        <Button
          onClick={() => router.push('/event/upload')}
          colorScheme="purple"
          size="sm"
          mb={2}
        >
          + 이벤트 등록
        </Button>
      </Box>

      {/* Category Tabs */}
      <Box bg="white" pt={10} pb={6} px={6} maxW="1280px" mx="auto">
        <Flex gap={2} borderBottom="1px solid #5f0080">
          {categories.map((category) => (
            <Button
              key={category}
              variant="ghost"
              borderBottom={activeCategory === category ? '2px solid #5f0080' : '1px solid transparent'}
              borderRadius="0"
              fontWeight={activeCategory === category ? 'bold' : 'normal'}
              color={activeCategory === category ? '#5f0080' : 'black'}
              onClick={() => setActiveCategory(category)}
              _hover={{ bg: 'transparent', color: '#5f0080' }}
            >
              {category}
            </Button>
          ))}
        </Flex>
      </Box>

      {/* 기존 이벤트 목록 */}
      <Box bg="white" py={12} px={6} maxW="1280px" mx="auto">
        <Text fontSize="2xl" fontWeight="bold" mb={8} borderBottom="2px solid #333" pb={2}>
          진행중인 이벤트
        </Text>

        {filteredEvents.map(([category, items]) => (
          <Box key={category} mb={16}>
            <Text fontSize="xl" fontWeight="bold" mt={16} mb={4} borderLeft="4px solid #5f0080" pl={2}>
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
                  _hover={{ boxShadow: 'xl', transform: 'translateY(-5px)' }}
                  border="1px solid #eee"
                >
                  <Box w="100%" h="200px" overflow="hidden">
                    <img
                      src={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}${event.image}`}
                      alt={event.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Box>
                  <Box p={3}>
                    <Text fontSize="sm" fontWeight="semibold" mb={1} noOfLines={2}>
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

      <Footer footerColor="white" footerBg="#1a1a1a" footerBorder="transparent" />
    </>
  );
}