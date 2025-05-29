'use client';

import React,{useState} from 'react';

import Link from "next/link";
import { Flex, Button, HStack, Image, Box,Text } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
   const isHome = pathname === '/' || pathname.startsWith('/home') 
  || pathname.startsWith('/movie') || pathname.startsWith('/booking') || pathname.startsWith('/search');
  const footerBg = isHome ? '#1a1a1a' : 'white';
  const footerColor = isHome ? 'white' : 'black';
  const footerBorder = isHome ? 'transparent' : '#ccc';
  const [BoxAwidth,setBoxAwidth]=useState(10);
  const [BoxBwidth,setBoxBwidth]=useState(10);
  const [BoxCwidth,setBoxCwidth]=useState(10);
  const [BoxDwidth,setBoxDwidth]=useState(10);

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
      <Flex flexDirection="column" lineHeight="18px" mb="20px" onMouseEnter={()=>{setBoxAwidth(20);}} onMouseLeave={()=>{setBoxAwidth(10);}}>
        <h5 style={{ fontSize: 14, color: footerColor }}>고객센터</h5>
        <Box w={BoxAwidth} h="2px" bg="#6B46C1" mb="5px" transition='all 0.3s ease-in-out'></Box>
        <span style={{fontSize:12}}>1544-1234</span>
        <span style={{fontSize:12}}>운영시간 | 오전 10:00 ~ 오후 6:00</span>
        <span style={{fontSize:12}}>점심시간 | 오후 12:00 ~ 오후 1:30</span>
        <span style={{fontSize:12}}>토/일/공휴일 휴무</span>
      </Flex>
      <Flex flexDirection="column" lineHeight="18px" mb="20px" onMouseEnter={()=>{setBoxBwidth(20);}} onMouseLeave={()=>{setBoxBwidth(10);}}>
        <h5 style={{ fontSize: 14, color: footerColor }}>주소 안내</h5>
        <Box w={BoxBwidth} h="2px" bg="#6B46C1" mb="5px" transition='all 0.3s ease-in-out'></Box>
        <span style={{fontSize:12}}>서울특별시 강남구 테헤란로 87길 22 도심공항터미널 건물 408호</span>
      </Flex>
      <Flex flexDirection="column" lineHeight="18px" mb="20px" onMouseEnter={()=>{setBoxCwidth(20);}} onMouseLeave={()=>{setBoxCwidth(10);}}>
        <h5 style={{ fontSize: 14, color: footerColor }}>빠른 메뉴</h5>
        <Box w={BoxCwidth} h="2px" bg="#6B46C1" mb="5px" transition='all 0.3s ease-in-out'></Box>
        <HStack spacing={2}>
          <Button w="60px" h="30px" color="white" bg="#6B46C1" _hover={{bg:'#553C9A'}} border="1px solid #444" fontSize="12px" borderRadius="5px">
            <Link href='/booking'>
              예매
            </Link>
          </Button>
          <Button w="90px" h="30px" color="white" bg="#6B46C1" _hover={{bg:'#553C9A'}} border="1px solid #444" fontSize="12px" borderRadius="5px">
            <Link href='/mypage'>
              마이페이지
            </Link>
          </Button>
        </HStack>
      </Flex>
      <Flex w='100px' flexDirection="column" lineHeight="18px" mb="20px" onMouseEnter={()=>{setBoxDwidth(20);}} onMouseLeave={()=>{setBoxDwidth(10);}}>
        <h5 style={{ fontSize: 14, color: footerColor }}>회사 정보</h5>
        <Box w={BoxDwidth} h="2px" bg="#6B46C1" mb="5px" transition='all 0.3s ease-in-out'></Box>
        <Link href='/home'><Text fontSize='14px' lineHeight='22px' _hover={{textDecoration:'underline'}}>이용약관</Text></Link>
        <Link href='/home'><Text fontSize='14px' lineHeight='22px' _hover={{textDecoration:'underline'}}>개인정보처리방침</Text></Link>
        <Link href='/home'><Text fontSize='14px' lineHeight='22px' _hover={{textDecoration:'underline'}}>사이트 이용가이드</Text></Link>
        <HStack spacing={2} mt="8px">
          <Link href="https://instagram.com" target="_blank">
            <Flex w='25px' h='25px' justifyContent='center' alignItems='center'>
              <Image
                w="20px"
                h="20px"
                loading="lazy"
                borderRadius="5px"
                src="https://mblogthumb-phinf.pstatic.net/MjAyMTA5MTlfMjUg/MDAxNjMyMDE3OTA4NTA0.dhHpehPf66HwINvBr6OijefwiqeXdPcbcdCU1m1nZ1Ig.3R8X4ori4uDAxmc535BOc6_M8zQHWSfotX-gO8YX4Mwg.PNG.brotherm1n/SE-5c4e2eac-5093-4df9-9626-2bf8df6eb194.png?type=w800"
                alt="Instagram Logo"
                transition='all 0.3s ease-in-out'
                _hover={{transform:'rotate(-10deg) scale(1.1)',filter:'brightness(1.2)'}}
              />
            </Flex>
          </Link>
          <Link href="https://kakao.com" target="_blank">
            <Image
              w="25px"
              h="25px"
              loading="lazy"
              borderRadius="5px"
              src="http://localhost:9999/images/kakao.png"
              alt="Kakao Logo"
              transition='all 0.3s ease-in-out'
              _hover={{transform:'rotate(-10deg) scale(1.1)',filter:'brightness(1.2)'}}
            />
          </Link>
        </HStack>
      </Flex>
    </Flex>
  );
}
