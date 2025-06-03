"use client";

import React,{ useState, useEffect } from 'react';

import Link from "next/link";
import { Flex, Box, Icon, Text } from "@chakra-ui/react";
import { FiUser } from "react-icons/fi";

import { usePathname } from "next/navigation";

export default function Header({ userInfo }) {

  const [mounted, setMounted] = useState(false);

  const pathname = usePathname();
  const isRealHome =
    pathname === "/" ||
    pathname.startsWith("/home"); /* 진짜 home인지 확인하기 위한 변수 */
  const isHome =
    pathname === "/" ||
    pathname.startsWith("/home") ||
    pathname === "/movie/" ||
    pathname.startsWith("/booking") ||
    pathname.startsWith("/search") ||
    pathname.startsWith("/checkout");
  const headerBg = isHome ? "#1a1a1a" : "white";
  const headerColor = isHome ? "white" : "black";
  const hoverColor = "gray.500";

  useEffect(() => {
    setMounted(true);
  }, []);

  // 만약 아직 클라이언트 마운트가 안 된 상태라면,
  // (a) 헤더를 아예 그리지 않거나, (b) 어두운 bg로 강제 렌더
  if (!mounted) {
    // (a) 아무것도 안 그린다 → 로딩 중 빈 공간만 보일 수 있음
    // return null;

    // (b) 헤더를 어두운 색(#1a1a1a) 고정으로 렌더하고, 나머지 정보는 비워두기
    const tempbg=isHome ? "#1a1a1a" : "white";
    return (
      <Flex
        w="100%"
        h={{ base: 'auto', md: '100px' }}
        bg={tempbg}
        p={{ base: '20px', md: '40px' }}
      />
    );
  }

  return (
    <>
      <Flex
        w="100%"
        minW="300px"
        h={{ base: "auto", md: "100px" }}
        direction={{ base: "column", md: "row" }}
        align={{ base: "flex-start", md: "center" }}
        justify="space-between"
        bg={headerBg}
        p={{ base: "20px", md: "40px" }}
        position="relative"
        boxShadow="0 2px 4px rgba(0, 0, 0, 0.05)"
        borderBottom="1px solid rgba(0, 0, 0, 0.1)"
        gap={{ base: 4, md: 0 }}
      >
        {/* 로고 */}
        <Box>
          <Link href="/home" style={{ textDecoration: "none" }}>
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
          direction={{ base: "column", md: "row" }}
          gap={{ base: 2, md: 5 }}
          align={{ base: "flex-start", md: "center" }}
          fontSize={{ base: "16px", md: "20px" }}
          position={{ md: "absolute" }}
          left={{ md: "50%" }}
          transform={{ md: "translateX(-50%)" }}
        >
          <Link href="/movie">
            <Box
              transition="all 0.2s ease"
              color={headerColor}
              cursor="pointer"
              _hover={{ color: hoverColor }}
            >
              영화
            </Box>
          </Link>
          <Link href="/booking">
            <Box
              transition="all 0.2s ease"
              color={headerColor}
              cursor="pointer"
              _hover={{ color: hoverColor }}
            >
              예매
            </Box>
          </Link>
          <Link href="/theater">
            <Box
              transition="all 0.2s ease"
              color={headerColor}
              cursor="pointer"
              _hover={{ color: hoverColor }}
            >
              영화관
            </Box>
          </Link>
          <Link href="/store">
            <Box
              transition="all 0.2s ease"
              color={headerColor}
              cursor="pointer"
              _hover={{ color: hoverColor }}
            >
              스토어
            </Box>
          </Link>
          <Link href="/notice">
            <Box
              transition="all 0.2s ease"
              color={headerColor}
              cursor="pointer"
              _hover={{ color: hoverColor }}
            >
              공지
            </Box>
          </Link>
          <Link href="/event">
            <Box
              transition="all 0.2s ease"
              color={headerColor}
              cursor="pointer"
              _hover={{ color: hoverColor }}
            >
              이벤트
            </Box>
          </Link>
        </Flex>

        {/* 유저 영역 */}
        <Flex
          direction={{ base: "column", md: "row" }}
          align={{ base: "flex-start", md: "center" }}
          gap={{ base: 2, md: 4 }}
          fontSize="15px" overflow='visible'
        >
          {userInfo && isRealHome ? (
            <>
              <Text color={headerColor}>{userInfo.name}님 환영합니다</Text>
              {userInfo.auth === "ADMIN" && (
                <Text
                  as={Link}
                  href="/admin"
                  color="#6B46C1"
                  fontWeight="bold"
                  _hover={{ color: "#9F7AEA" }}
                >
                  관리자
                </Text>
              )}
              <Text
                transition="all 0.2s ease"
                color={headerColor}
                _hover={{ color: hoverColor }}
              >
                <Link
                  href={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/logout`}
                >
                  로그아웃
                </Link>
              </Text>
            </>
          ) : userInfo ? (
            <>
              {userInfo.auth === "ADMIN" && (
                <Text
                  as={Link}
                  href="/admin"
                  color="#6B46C1"
                  fontWeight="bold"
                  _hover={{ color: "#9F7AEA" }}
                >
                  관리자
                </Text>
              )}
              <Text
                transition="all 0.2s ease"
                color={headerColor}
                _hover={{ color: hoverColor }}
              >
                <Link
                  href={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/logout`}
                >
                  로그아웃
                </Link>
              </Text>
            </>
          ) : (
            <>
              <Text
                transition="all 0.2s ease"
                color={headerColor}
                _hover={{ color: hoverColor }}
              >
                <Link href="/signin">로그인</Link>
              </Text>
              <Text
                transition="all 0.2s ease"
                color={headerColor}
                _hover={{ color: hoverColor }}
              >
                <Link href="/join">회원가입</Link>
              </Text>
            </>
          )}

          <Text
            transition="all 0.2s ease"
            color="#ff4d4d"
            _hover={{
              color: "#ff6666",
              textShadow: "0 0 5px rgba(255, 77, 77, 0.5)",
            }}
          >
            <Link href='/booking'>
              빠른예매
            </Link>
          </Text>
          <Link href="/mypage" style={{overflow:'visible'}}>
            <Icon
              as={FiUser}
              boxSize={6}
              color={headerColor}
              transition="all 0.2s ease"
              position="relative"
              bottom="2px"
              _hover={{
                transform: "scale(1.2)",
                filter: "brightness(1.2)",
                color: hoverColor
              }}
            />
          </Link>
        </Flex>
      </Flex>
    </>
  );
}
