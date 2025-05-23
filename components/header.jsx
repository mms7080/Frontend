'use client';

import Link from 'next/link';
import { Flex, Box, IconButton, Stack, Text } from '@chakra-ui/react';
import { FiUser } from 'react-icons/fi';
import { usePathname } from 'next/navigation';
import Navigator from './navigator';

export default function Header({ userInfo }) {
  const pathname = usePathname();
  const isHome = pathname === '/' || pathname.startsWith('/home') || pathname.startsWith('/movie');
  const headerBg = isHome ? '#1a1a1a' : 'white';
  const headerColor = isHome ? 'white' : 'black';
  const hoverColor = 'gray.500';

  return (
    <>
      <Flex
        w="100%"
        minW="300px"
        h={{ base: 'auto', md: '100px' }}
        direction={{ base: 'column', md: 'row' }}
        align={{ base: 'flex-start', md: 'center' }}
        justify="space-between"
        bg={headerBg}
        p={{ base: '20px', md: '40px' }}
        position="relative"
        boxShadow="0 2px 4px rgba(0, 0, 0, 0.05)"
        borderBottom="1px solid rgba(0, 0, 0, 0.1)"
        gap={{ base: 4, md: 0 }}
      >
        {/* 로고 */}
        <Box>
          <Link href="/home" style={{ textDecoration: 'none' }}>
            <Text
              color={headerColor}
              fontSize={{ base: 20, md: 24 }}
              fontWeight="bold"
              letterSpacing={3}
              cursor="pointer"
              lineHeight="1.2"
            >
              FILMORA
            </Text>
          </Link>
          <Text color="#ccc" fontSize="10px" letterSpacing="2">
            MEET PLAY SHARE
          </Text>
        </Box>

        {/* 메뉴 */}
        <Flex
          direction={{ base: 'column', md: 'row' }}
          gap={{ base: 2, md: 5 }}
          align={{ base: 'flex-start', md: 'center' }}
          fontSize={{ base: '16px', md: '20px' }}
          position={{ md: 'absolute' }}
          left={{ md: '50%' }}
          transform={{ md: 'translateX(-50%)' }}
        >
          <Link href="/movie"><Box transition='all 0.2s ease' color={headerColor} cursor="pointer" _hover={{ color: hoverColor }}>영화</Box></Link>
          <Link href="/booking"><Box transition='all 0.2s ease' color={headerColor} cursor="pointer" _hover={{ color: hoverColor }}>예매</Box></Link>
          <Box transition='all 0.2s ease' color={headerColor} cursor="pointer" _hover={{ color: hoverColor }}>극장</Box>
          <Link href="/store"><Box transition='all 0.2s ease' color={headerColor} cursor="pointer" _hover={{ color: hoverColor }}>스토어</Box></Link>
          <Link href="/notice"><Box transition='all 0.2s ease' color={headerColor} cursor="pointer" _hover={{ color: hoverColor }}>공지</Box></Link>
          <Link href="/event"><Box transition='all 0.2s ease' color={headerColor} cursor="pointer" _hover={{ color: hoverColor }}>이벤트</Box></Link>
        </Flex>

        {/* 유저 영역 */}
        <Flex
          direction={{ base: 'column', md: 'row' }}
          align={{ base: 'flex-start', md: 'center' }}
          gap={{ base: 2, md: 4 }}
          fontSize="15px"
        >
          {userInfo ? (
            <>
              <Text color={headerColor}>{userInfo.name}님 환영합니다</Text>
              <Text transition='all 0.2s ease' color={headerColor} _hover={{color:'#00c3ff'}}>
                <Link href={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/logout`}>로그아웃</Link>
              </Text>
            </>
          ) : (
            <>
              <Text transition='all 0.2s ease' color={headerColor} _hover={{color:'#00c3ff'}}><Link href="/signin">로그인</Link></Text>
              <Text transition='all 0.2s ease' color={headerColor} _hover={{color:'#00c3ff'}}><Link href="/join">회원가입</Link></Text>
            </>
          )}
          <Text transition='all 0.2s ease' color="#ff4d4d" _hover={{color:'#ff6666',textShadow:'0 0 5px rgba(255, 77, 77, 0.5)'}}>빠른예매</Text>
          <Link href="/mypage">
            <FiUser transition='all 0.2s ease' size={24} color={headerColor} _hover={{transform:'scale(1.2)',filter:'brightness(1.2)'}}/>
          </Link>
        </Flex>
      </Flex>
      <Navigator />
    </>
  );
}
