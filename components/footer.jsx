'use client';

import { Flex, Button, HStack, Image, Box } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
   const isHome = pathname === '/' || pathname.startsWith('/home') 
  || pathname.startsWith('/movie') || pathname.startsWith('/booking2');
  const footerBg = isHome ? '#1a1a1a' : 'white';
  const footerColor = isHome ? 'white' : 'black';
  const footerBorder = isHome ? 'transparent' : '#ccc';

  return (
    <Flex
      w="100%"
      bg={footerBg}
      color="#aaa"
      justifyContent="space-between"
      px={{ base: '20px', md: '60px', lg: '100px', xl: '200px', '2xl': '300px' }}
      py="30px"
      fontSize="11px"
      borderTop={`1px solid ${footerBorder}`}
      flexWrap="wrap"
    >
      <Flex flexDirection="column" lineHeight="18px" mb="20px">
        <h5 style={{ fontSize: 14, color: footerColor }}>고객센터</h5>
        <Box w="40px" h="2px" bg="#00c3ff" mb="5px"></Box>
        <span>1544-1234</span>
        <span>운영시간 | 오전 10:00 ~ 오후 6:00</span>
        <span>점심시간 | 오후 12:00 ~ 오후 1:30</span>
        <span>토/일/공휴일 휴무</span>
      </Flex>
      <Flex flexDirection="column" lineHeight="18px" mb="20px">
        <h5 style={{ fontSize: 14, color: footerColor }}>주소 안내</h5>
        <Box w="40px" h="2px" bg="#00c3ff" mb="5px"></Box>
        <span>서울특별시 강남구 테헤란로 87길 22 도심공항터미널 건물 408호</span>
      </Flex>
      <Flex flexDirection="column" lineHeight="18px" mb="20px">
        <h5 style={{ fontSize: 14, color: footerColor }}>빠른 메뉴</h5>
        <Box w="40px" h="2px" bg="#00c3ff" mb="5px"></Box>
        <HStack spacing={2}>
          <Button w="60px" h="30px" color="white" bg="#2d2d2d" border="1px solid #444" fontSize="10px" borderRadius="5px">
            예매 내역
          </Button>
          <Button w="60px" h="30px" color="white" bg="#2d2d2d" border="1px solid #444" fontSize="10px" borderRadius="5px">
            마이페이지
          </Button>
        </HStack>
      </Flex>
      <Flex flexDirection="column" lineHeight="18px" mb="20px">
        <h5 style={{ fontSize: 14, color: footerColor }}>회사 정보</h5>
        <Box w="40px" h="2px" bg="#00c3ff" mb="5px"></Box>
        <span>이용약관</span>
        <span>개인정보처리방침</span>
        <span>사이트 이용가이드</span>
        <HStack spacing={2} mt="8px">
          <a href="https://instagram.com" target="_blank">
            <Image
              w="20px"
              h="20px"
              loading="lazy"
              borderRadius="5px"
              src="https://mblogthumb-phinf.pstatic.net/MjAyMTA5MTlfMjUg/MDAxNjMyMDE3OTA4NTA0.dhHpehPf66HwINvBr6OijefwiqeXdPcbcdCU1m1nZ1Ig.3R8X4ori4uDAxmc535BOc6_M8zQHWSfotX-gO8YX4Mwg.PNG.brotherm1n/SE-5c4e2eac-5093-4df9-9626-2bf8df6eb194.png?type=w800"
              alt="Instagram Logo"
            />
          </a>
          <a href="https://kakao.com" target="_blank">
            <Image
              w="20px"
              h="20px"
              loading="lazy"
              borderRadius="5px"
              src="data:image/png;base64,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"
              alt="Kakao Logo"
            />
          </a>
        </HStack>
      </Flex>
    </Flex>
  );
}
