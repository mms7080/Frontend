'use client';

import Link from 'next/link';
import { Flex, Box } from '@chakra-ui/react';
import { FiUser } from 'react-icons/fi';
import { usePathname } from 'next/navigation';
import Navigator from './navigator';

export default function Header({ userInfo }) {
  const pathname = usePathname();
  const isHome = pathname === '/' || pathname.startsWith('/home');
  const headerBg = isHome ? '#1a1a1a' : 'white';
  const headerColor = isHome ? 'white' : 'black';
  const hoverColor = isHome ? 'black' : 'gray.500';

  return <>
    <Flex
      w="calc(100vw - 17px)"
      minW="1000px"
      h="100px"
      alignItems="center"
      bg={headerBg}
      p="40px"
      position='relative'
      boxShadow="0 2px 4px rgba(0, 0, 0, 0.05)"
      borderBottom="1px solid rgba(0, 0, 0, 0.1)"
    >
      {/* 로고 */}
      <Flex flexDirection="column" lineHeight="30px" flex='1'>
        <Link href="/home" style={{ textDecoration: 'none' }}>
          <span style={{ color: headerColor, fontSize: 24, letterSpacing: 3, cursor: 'pointer' }}>
            FILMORA
          </span>
        </Link>
        <span style={{ color: '#ccc', fontSize: 10, letterSpacing: 2 }}>MEET PLAY SHARE</span>
      </Flex>

      {/* 메뉴 */}
      <Flex gap="20px" fontSize="20px" position='absolute' left='50%' transform='translateX(-50%)'>
        {['영화', '예매', '극장', '스토어', '공지'].map((menu, idx) => (
          <Box
            key={idx}
            color={headerColor}
            cursor="pointer"
            _hover={{ color: hoverColor }}
          >
            {menu}
          </Box>
        ))}

        <Link href="/event" style={{ textDecoration: 'none' }}>
          <Box color={headerColor} cursor="pointer" _hover={{ color: hoverColor }}>
            이벤트
          </Box>
        </Link>
      </Flex>

      {/* 유저 정보 */}
      <Flex gap="15px" fontSize="15px" flex='1' justifyContent='flex-end'>
        {userInfo ? (
          <>
            <span style={{ color: headerColor }}>{userInfo.name}님 환영합니다</span>
            <span style={{ color: headerColor }}>
              <a href={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/logout`}>로그아웃</a>
            </span>
          </>
        ) : (
          <>
            <span style={{ color: headerColor }}>
              <a href="/signin">로그인</a>
            </span>
            <span style={{ color: headerColor }}>
              <a href="/join">회원가입</a>
            </span>
          </>
        )}
        <span style={{ color: '#ff4d4d' }}>빠른예매</span>
        <FiUser size={25} color={headerColor} style={{ bottom: 5, position: 'relative' }} />
      </Flex>
    </Flex>
    <Navigator/>
  </>;
}
