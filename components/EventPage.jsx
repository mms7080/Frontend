'use client';

import { useEffect, useState } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import Header from './header';
import Footer from './footer';

export default function EventPage({ serverEvents }) {
  const [events] = useState(serverEvents || {}); // serverEvents 없을 때 대비
  const [user, setUser] = useState(null);

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

  return (
    <>
      <Header headerColor="white" headerBg="#1a1a1a" userInfo={user} />
      <Box bg="white" py={12} px={6} maxW="1280px" mx="auto">
        <Text fontSize="2xl" fontWeight="bold" mb={8} borderBottom="2px solid #333" pb={2}>
          진행중인 이벤트
        </Text>

        {Object.entries(events).map(([category, items]) => (
          <Box key={category} mb={16}>
            <Text fontSize="xl" fontWeight="bold" mb={4} borderLeft="4px solid #5f0080" pl={2}>
              {category}
            </Text>
            <Flex wrap="wrap" gap={120}>
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
