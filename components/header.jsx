"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Flex, Box, Icon, Text } from "@chakra-ui/react";
import { FiUser } from "react-icons/fi";

export default function Header({ userInfo }) {
  const [mounted, setMounted] = useState(false);
  const [reservationAlert, setReservationAlert] = useState(null);
  const [showingAlert, setShowingAlert] = useState(null);

  const pathname = usePathname();
  const router = useRouter();

  const isRealHome = pathname === "/" || pathname.startsWith("/home");
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

    const alertData = localStorage.getItem("latestReservationAlert");
    if (alertData) {
      const parsed = JSON.parse(alertData);
      setReservationAlert(parsed);
    }

    const interval = setInterval(() => {
      const data = localStorage.getItem("latestReservationAlert");
      if (!data) return;

      const { title, notifyTime } = JSON.parse(data);
      const now = Date.now();

      if (notifyTime && now >= new Date(notifyTime).getTime()) {
        setShowingAlert({ title });
        localStorage.removeItem("latestReservationAlert");
        setReservationAlert(null);
      }
    }, 5000); // 5초마다 체크

    return () => clearInterval(interval);
  }, []);

  const clearReservationAlert = () => {
    localStorage.removeItem("latestReservationAlert");
    setReservationAlert(null);
    router.push("/mypage");
  };

  if (!mounted) {
    return (
      <Flex
        w="100%"
        h={{ base: "auto", md: "100px" }}
        bg={headerBg}
        p={{ base: "20px", md: "40px" }}
      />
    );
  }

  return (
    <>
      {/* ✅ 예매 완료 알림 */}
      {reservationAlert && (
        <Box
          position="fixed"
          top="0"
          left="0"
          w="100%"
          bg="#fef3c7"
          borderBottom="1px solid #facc15"
          color="#78350f"
          fontSize="14px"
          fontWeight="medium"
          py={2}
          textAlign="center"
          zIndex="9999"
          cursor="pointer"
          _hover={{ bg: "#fde68a" }}
          onClick={clearReservationAlert}
        >
          🛎️ <strong>[{reservationAlert.title}]</strong> 예매가 완료되었습니다! (마이페이지로 이동)
        </Box>
      )}

      {/* ✅ 상영 30분 전 알림 */}
      {showingAlert && (
        <Box
          position="fixed"
          top={reservationAlert ? "40px" : "0"}
          left="0"
          w="100%"
          bg="#dbf4ff"
          borderBottom="1px solid #38bdf8"
          color="#0369a1"
          fontSize="14px"
          fontWeight="medium"
          py={2}
          textAlign="center"
          zIndex="9998"
          cursor="pointer"
          _hover={{ bg: "#bae6fd" }}
          onClick={() => setShowingAlert(null)}
        >
          ⏰ <strong>[{showingAlert.title}]</strong> 상영 30분 전입니다! 준비해주세요!
        </Box>
      )}

      {/* ✅ 기존 헤더 */}
      <Flex
        w="100%"
        minW="300px"
        mt={
          reservationAlert && showingAlert
            ? "80px"
            : reservationAlert || showingAlert
            ? "40px"
            : "0"
        }
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
          <Link href="/home">
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
          {["movie", "booking", "theater", "store", "notice", "event"].map((path) => (
            <Link key={path} href={`/${path}`}>
              <Box
                transition="all 0.2s ease"
                color={headerColor}
                cursor="pointer"
                _hover={{ color: hoverColor }}
              >
                {{
                  movie: "영화",
                  booking: "예매",
                  theater: "영화관",
                  store: "스토어",
                  notice: "공지",
                  event: "이벤트"
                }[path]}
              </Box>
            </Link>
          ))}
        </Flex>

        {/* 유저 영역 */}
        <Flex
          direction={{ base: "column", md: "row" }}
          align={{ base: "flex-start", md: "center" }}
          gap={{ base: 2, md: 4 }}
          fontSize="15px"
        >
          {userInfo ? (
            <>
              {isRealHome && (
                <Text color={headerColor}>{userInfo.name}님 환영합니다</Text>
              )}
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
              <Text color={headerColor} _hover={{ color: hoverColor }}>
                <Link href={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/logout`}>
                  로그아웃
                </Link>
              </Text>
            </>
          ) : (
            <>
              <Text color={headerColor} _hover={{ color: hoverColor }}>
                <Link href="/signin">로그인</Link>
              </Text>
              <Text color={headerColor} _hover={{ color: hoverColor }}>
                <Link href="/join">회원가입</Link>
              </Text>
            </>
          )}

          <Text
            color="#ff4d4d"
            _hover={{
              color: "#ff6666",
              textShadow: "0 0 5px rgba(255, 77, 77, 0.5)",
            }}
          >
            <Link href="/booking">빠른예매</Link>
          </Text>

          {userInfo ? (
            <Link href="/mypage">
              <Icon
                as={FiUser}
                boxSize={6}
                color={headerColor}
                _hover={{
                  transform: "scale(1.2)",
                  filter: "brightness(1.2)",
                  color: hoverColor,
                }}
              />
            </Link>
          ) : (
            <Box w="24px" h="24.25px" />
          )}
        </Flex>
      </Flex>
    </>
  );
}
