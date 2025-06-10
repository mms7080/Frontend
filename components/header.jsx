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
  Spinner,
} from "@chakra-ui/react";
import { FiUser } from "react-icons/fi";

export default function Header() {
  // 🔹 경로 및 라우터 관련
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

  // 🔹 사용자 및 상태 관련
  const [user, setUser] = useState(undefined); // undefined: 로딩, null: 비로그인
  const [reservationAlert, setReservationAlert] = useState(null);
  const [showingAlert, setShowingAlert] = useState(null);
  const [posterUrl, setPosterUrl] = useState(null);

  // 🔹 타이머 관련
  const [countdown, setCountdown] = useState(null);
  const [countdownMinimized, setCountdownMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 80 });
  const [countdownClosed, setCountdownClosed] = useState(false);

  // 🔹 드래그 관련
  const countdownRef = useRef(null);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  // 🔸 사용자 로그인 정보 fetch
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`,
          {
            credentials: "include",
          }
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        setUser(data);
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  // 🔸 타이머 관련 로컬스토리지 로딩/저장
  useEffect(() => {
    const savedClosed = localStorage.getItem("countdownClosed") === "true";
    setCountdownClosed(savedClosed);
    const savedPosition = localStorage.getItem("countdownPosition");
    if (savedPosition) setPosition(JSON.parse(savedPosition));
  }, []);

  useEffect(() => {
    localStorage.setItem("countdownClosed", countdownClosed);
  }, [countdownClosed]);

  // 🔸 창 크기 변경 시 타이머 위치 조정
  useEffect(() => {
    const handleResize = () => {
      const maxX = window.innerWidth - 150;
      const maxY = window.innerHeight - 100;
      setPosition((prev) => {
        const clamped = {
          x: Math.min(prev.x, maxX),
          y: Math.min(prev.y, maxY),
        };
        localStorage.setItem("countdownPosition", JSON.stringify(clamped));
        return clamped;
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🔸 다른 탭에서 알림 데이터 반영
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

  // 🔸 타이머 적용 및 알림 처리
  useEffect(() => {
    const alertData = localStorage.getItem("latestReservationAlert");
    if (alertData) setReservationAlert(JSON.parse(alertData));

    const applyCountdown = () => {
      const data = localStorage.getItem("latestReservationCountdown");
      if (data && user) {
        const { title, showTime, movieId } = JSON.parse(data);
        const now = Date.now();
        const target = new Date(showTime).getTime();
        const diff = target - now;

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

          if (diff <= 30 * 60 * 1000) setShowingAlert({ title });

          if (!posterUrl) {
            fetch(
              `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/movie/${movieId}`
            )
              .then((res) => res.json())
              .then((data) => {
                if (data?.poster) {
                  setPosterUrl(
                    `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}${data.poster}`
                  );
                }
              })
              .catch(() => {});
          }
        }
      }
    };

    applyCountdown();

    const interval = setInterval(() => {
      const alertData = localStorage.getItem("latestReservationAlert");
      if (alertData) {
        const { title, notifyTime } = JSON.parse(alertData);
        if (notifyTime && Date.now() >= new Date(notifyTime).getTime()) {
          setShowingAlert({ title });
          localStorage.removeItem("latestReservationAlert");
          setReservationAlert(null);
        }
      }
      applyCountdown();
    }, 1000);

    return () => clearInterval(interval);
  }, [user, posterUrl]);

  // 🔸 타이머 드래그 관련 핸들러
  const startDrag = (e) => {
    dragging.current = true;
    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY;
    offset.current = { x: clientX - position.x, y: clientY - position.y };

    window.addEventListener("mousemove", onDrag);
    window.addEventListener("mouseup", endDrag);
    window.addEventListener("touchmove", onDrag);
    window.addEventListener("touchend", endDrag);
  };

  const onDrag = (e) => {
    if (!dragging.current) return;
    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY;
    const newX = Math.max(
      0,
      Math.min(clientX - offset.current.x, window.innerWidth - 150)
    );
    const newY = Math.max(
      0,
      Math.min(clientY - offset.current.y, window.innerHeight - 100)
    );
    setPosition({ x: newX, y: newY });
    localStorage.setItem(
      "countdownPosition",
      JSON.stringify({ x: newX, y: newY })
    );
  };

  const endDrag = () => {
    dragging.current = false;
    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("mouseup", endDrag);
    window.removeEventListener("touchmove", onDrag);
    window.removeEventListener("touchend", endDrag);
  };

  // 🔸 예매 알림 클릭 시 마이페이지 이동
  const clearReservationAlert = () => {
    localStorage.removeItem("latestReservationAlert");
    setReservationAlert(null);
    router.push("/mypage");
  };

  return (
    <>
      {/* 🔸 예매 완료 알림 */}
      {user && reservationAlert && (
        <Box
          position="fixed"
          top="0"
          left="0"
          w="100%"
          h="40px"
          bg="#f3e8ff"
          borderBottom="1px solid #a855f7"
          color="#6b21a8"
          fontSize="14px"
          py={2}
          zIndex="9999"
          textAlign="center"
          cursor="pointer"
          _hover={{ bg: "#e9d5ff" }}
          onClick={clearReservationAlert}
        >
          🔔 <strong>[{reservationAlert.title}]</strong> 예매가 완료되었습니다!
          (마이페이지로 이동)
        </Box>
      )}

      {/* 🔸 상영 30분 전 알림 */}
      {showingAlert && (
        <Box
          position="fixed"
          top={reservationAlert ? "40px" : "0"}
          left="0"
          w="100%"
          h="40px"
          bg="#dbf4ff"
          borderBottom="1px solid #38bdf8"
          color="#0369a1"
          fontSize="14px"
          py={2}
          zIndex="9998"
          textAlign="center"
          cursor="pointer"
          _hover={{ bg: "#bae6fd" }}
          onClick={() => router.push("/mypage")}
        >
          ⏰ <strong>[{showingAlert.title}]</strong> 상영 30분 전입니다! 입장
          부탁드립니다
        </Box>
      )}

      {/* 🔸 타이머 컴포넌트 */}
      {countdown && user && !countdownClosed && (
        <Flex
          ref={countdownRef}
          position="fixed"
          left={`${position.x}px`}
          top={`${position.y}px`}
          direction={{ base: "column", md: "row" }}
          onMouseDown={startDrag}
          onTouchStart={startDrag}
          bg="rgba(255, 255, 255, 0.9)"
          color="black"
          p={3}
          borderRadius="lg"
          boxShadow="lg"
          zIndex="9999"
          fontSize="14px"
          cursor="grab"
          alignItems="center"
          maxW="calc(100vw - 20px)"
        >
          {posterUrl && !countdownMinimized && (
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
                <Button
                  size="xs"
                  colorScheme="red"
                  onClick={() => setCountdownClosed(true)}
                >
                  닫기
                </Button>
              </Flex>
            </Box>
          ) : (
            <Flex align="center" gap={2}>
              <Text fontSize="sm">
                <strong>{countdown.title}</strong> - 🕙 {countdown.timeLeft}
              </Text>
              <Button size="xs" onClick={() => setCountdownMinimized(false)}>
                펼치기
              </Button>
              <Button
                size="xs"
                colorScheme="red"
                onClick={() => setCountdownClosed(true)}
              >
                X
              </Button>
            </Flex>
          )}
        </Flex>
      )}

      {/* 🔸 타이머 닫은 후 복원 버튼 */}
      {user && countdownClosed && (
        <Button
          position="fixed"
          right="20px"
          bottom="20px"
          zIndex="9999"
          size="sm"
          colorScheme="purple"
          onClick={() => setCountdownClosed(false)}
        >
          ⏱ 타이머 다시 열기
        </Button>
      )}

      {/* 🔸 메인 Header 영역 */}
      <Flex
        w="100%"
        minW="300px"
        mt={
          user && reservationAlert && showingAlert
            ? "80px"
            : user && (reservationAlert || showingAlert)
            ? "40px"
            : "0"
        }
        h="100px"
        direction={{ base: "column", md: "row" }}
        align={{ base: "flex-start", md: "center" }}
        justify="space-between"
        bg={headerBg}
        p="20px"
        borderBottom="1px solid rgba(0, 0, 0, 0.1)"
        boxShadow="0 2px 4px rgba(0, 0, 0, 0.05)"
      >
        {/* 로고 */}
        <Box>
          <Link href="/home">
            <Text
              color={headerColor}
              fontSize={{ base: 20, md: 24 }}
              fontWeight="bold"
              letterSpacing={3}
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
          {["movie", "booking", "theater", "store", "notice", "event"].map(
            (path) => (
              <Link key={path} href={`/${path}`}>
                <Box
                  color={headerColor}
                  cursor="pointer"
                  _hover={{ color: hoverColor }}
                >
                  {
                    {
                      movie: "영화",
                      booking: "예매",
                      theater: "영화관",
                      store: "스토어",
                      notice: "공지",
                      event: "이벤트",
                    }[path]
                  }
                </Box>
              </Link>
            )
          )}
        </Flex>

        {/* 로그인/사용자 정보 */}
        <Flex
          direction={{ base: "column", md: "row" }}
          align={{ base: "flex-start", md: "center" }}
          gap={{ base: 2, md: 4 }}
          fontSize="15px"
        >
          {user === undefined ? (
            <Spinner size="sm" color={headerColor} />
          ) : user ? (
            <>
              {isRealHome && (
                <Text color={headerColor}>{user.name}님 환영합니다</Text>
              )}
              {user.auth === "ADMIN" && (
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
                <Link
                  href={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/logout`}
                >
                  로그아웃
                </Link>
              </Text>
              <Text color="#ff4d4d" _hover={{ color: "red" }}>
                <Link href="/booking">빠른예매</Link>
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
              <Text color="#ff4d4d" _hover={{ color: "red" }}>
                <Link href="/booking">빠른예매</Link>
              </Text>
            </>
          )}

          {/* 마이페이지 아이콘 */}
          {user ? (
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
            <Box w="24px" h="24px" />
          )}
        </Flex>
      </Flex>
    </>
  );
}
