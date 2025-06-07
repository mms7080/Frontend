"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Flex,
  Box,
  Icon,
  Text,
  Button,
  Image,
} from "@chakra-ui/react";
import { FiUser } from "react-icons/fi";

export default function Header({ userInfo }) {
  const [mounted, setMounted] = useState(false);
  const [reservationAlert, setReservationAlert] = useState(null);
  const [showingAlert, setShowingAlert] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [countdownMinimized, setCountdownMinimized] = useState(false);
  const [position, setPosition] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("countdownPosition");
      return saved ? JSON.parse(saved) : { x: 20, y: 80 };
    }
    return { x: 20, y: 80 };
  });
  const countdownRef = useRef(null);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const [posterUrl, setPosterUrl] = useState(null);

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
  }, []);

  useEffect(() => {
    const handleStorage = () => {
      const alertData = localStorage.getItem("latestReservationShowAlert");
      if (alertData) {
        const { title } = JSON.parse(alertData);
        setShowingAlert({ title });
        localStorage.removeItem("latestReservationShowAlert");
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    const alertData = localStorage.getItem("latestReservationAlert");
    if (alertData) {
      const parsed = JSON.parse(alertData);
      setReservationAlert(parsed);
    }

    const applyCountdown = () => {
      const countdownData = localStorage.getItem("latestReservationCountdown");
      if (countdownData && userInfo) {
        const { title, showTime, movieId } = JSON.parse(countdownData);
        const now = new Date().getTime();
        const target = new Date(showTime).getTime();
        const diff = target - now;
        const total = target - new Date().setHours(0, 0, 0, 0);
        if (diff <= 0) {
          setCountdown(null);
          localStorage.removeItem("latestReservationCountdown");
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setCountdown({
            title,
            timeLeft: `${hours}시간 ${minutes}분 ${seconds}초`,
          });

          // 무조건 showingAlert 표시 (30분 전이면)
          if (diff <= 30 * 60 * 1000) {
            setShowingAlert({ title });
          }

          fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/movie/${movieId}`)
            .then((res) => res.json())
            .then((data) => {
              if (data?.poster) {
                setPosterUrl(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}${data.poster}`);
              }
            })
            .catch(() => {});
        }
      }
    };

    applyCountdown();

    const interval = setInterval(() => {
      const alertData = localStorage.getItem("latestReservationAlert");
      if (alertData) {
        const { title, notifyTime } = JSON.parse(alertData);
        const now = Date.now();
        if (notifyTime && now >= new Date(notifyTime).getTime()) {
          setShowingAlert({ title });
          localStorage.removeItem("latestReservationAlert");
          setReservationAlert(null);
        }
      }
      applyCountdown();
    }, 1000);

    return () => clearInterval(interval);
  }, [userInfo]);

  const clearReservationAlert = () => {
    localStorage.removeItem("latestReservationAlert");
    setReservationAlert(null);
    router.push("/mypage");
  };

  const clearCountdown = () => {
    localStorage.removeItem("latestReservationCountdown");
    setCountdown(null);
  };

  const startDrag = (e) => {
    dragging.current = true;
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const onDrag = (e) => {
    if (!dragging.current) return;
    const newPos = {
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    };
    setPosition(newPos);
    localStorage.setItem("countdownPosition", JSON.stringify(newPos));
  };

  const endDrag = () => {
    dragging.current = false;
  };

  if (!mounted) return null;

  return (
    <>
      {reservationAlert && (
        <Box
          position="fixed"
          top="0"
          left="0"
          w="100%"
          bg="#f3e8ff"
          borderBottom="1px solid #a855f7"
          color="#6b21a8"
          fontSize="14px"
          fontWeight="medium"
          py={2}
          textAlign="center"
          zIndex="9999"
          cursor="pointer"
          _hover={{ bg: "#e9d5ff" }}
          onClick={clearReservationAlert}
        >
          🔔 <strong>[{reservationAlert.title}]</strong> 예매가 완료되었습니다! (마이페이지로 이동)
        </Box>
      )}

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
          onClick={() => router.push("/mypage")}
        >
          ⏰ <strong>[{showingAlert.title}]</strong> 상영 30분 전입니다! 입장 부탁드립니다
        </Box>
      )}

      {countdown && userInfo && (
        <Flex
          ref={countdownRef}
          position="fixed"
          left={`${position.x}px`}
          top={`${position.y}px`}
          onMouseDown={startDrag}
          onMouseMove={onDrag}
          onMouseUp={endDrag}
          onMouseLeave={endDrag}
          bg="rgba(255, 255, 255, 0.5)"
          color="black"
          p={3}
          borderRadius="lg"
          boxShadow="lg"
          zIndex="9999"
          fontSize="14px"
          cursor="move"
          userSelect="none"
          alignItems="center"
        >
          {posterUrl && (
            <Image
              src={posterUrl}
              alt="포스터"
              boxSize="60px"
              borderRadius="md"
              mr={3}
            />
          )}
          {!countdownMinimized ? (
            <Box textAlign="left">
              <Text mb={1}>
                <strong>{countdown.title}</strong> 상영까지
              </Text>
              <Text mb={2}>🕙 {countdown.timeLeft}</Text>
              <Flex justify="flex-end" gap={2}>
                <Button size="xs" onClick={() => setCountdownMinimized(true)}>
                  작게
                </Button>
                <Button size="xs" onClick={clearCountdown} colorScheme="red">
                  닫기
                </Button>
              </Flex>
            </Box>
          ) : (
            <Flex align="center" gap={2}>
              <Text fontSize="sm">🕙 {countdown.timeLeft}</Text>
              <Button size="xs" onClick={() => setCountdownMinimized(false)}>
                펼치기
              </Button>
              <Button size="xs" onClick={clearCountdown} colorScheme="red">
                X
              </Button>
            </Flex>
          )}
        </Flex>
      )}

      {/* ✅ 정상 위치로 이동된 헤더 */}
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
                  event: "이벤트",
                }[path]}
              </Box>
            </Link>
          ))}
        </Flex>

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
