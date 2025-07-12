"use client";

import React, { useState, useEffect, useRef } from "react";
import Spinner from '../../../components/Spinner';
import {
  Box,
  Text,
  Flex,
  Image,
  Button,
  Grid,
} from "@chakra-ui/react";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "../../../components";
import Modal, { useModal } from '../../../components/movie/modal';

export default function SeatsPageMobile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [movie, setMovie] = useState(null);
  const [seatData, setSeatData] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [personCounts, setPersonCounts] = useState({ adult: 0, teen: 0, senior: 0, special: 0 });
  const {isModalOpen, isModalVisible, openModal, closeModal, modalContent, onConfirm, onCancel} = useModal();

  const searchParams = useSearchParams();
  const movieId = parseInt(searchParams.get("movieId"));
  const showtimeId = searchParams.get("showtimeId");
  const region = searchParams.get("region");
  const theater = searchParams.get("theater");
  const date = searchParams.get("date");
  const time = searchParams.get("time");
  const [clickedButton, setClickedButton] = useState(null); // key: 'adult', 'teen', ...

  const rowLabels = "ABCDEFGHI".split("");
  const cols = 12;

  const bookedSeats = seatData.filter(seat => seat.status === "RESERVED").map(seat => seat.fullSeatName);
  const disabledSeats = seatData.filter(seat => seat.status === "UNAVAILABLE").map(seat => seat.fullSeatName);

  const toggleSeat = (seatId) => {
    if (bookedSeats.includes(seatId)) return; // 예약 완료 좌석 클릭 막기
    const isDisabledSeat = disabledSeats.includes(seatId);
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats((prev) => prev.filter((s) => s !== seatId));
    } else {
      const normalSeats = selectedSeats.filter(
        (s) => !disabledSeats.includes(s)
      );
      const selectedDisabledSeats = selectedSeats.filter((s) =>
        disabledSeats.includes(s)
      );
      if (isDisabledSeat) {
        if (selectedDisabledSeats.length >= personCounts.special) {
          openModal("선택한 우대 좌석이 우대 인원 수를 초과했습니다.");
          return;
        }
      } else {
        if (normalSeats.length >= totalPeople - personCounts.special) {
          openModal("선택한 일반 좌석이 인원 수를 초과했습니다.");
          return;
        }
      }
      setSelectedSeats((prev) => [...prev, seatId]);
    }
  };

  const getSeatColor = (seatId) => {
    if (selectedSeats.includes(seatId)) return "#6B46C1";
    if (disabledSeats.includes(seatId)) return "blue.500";
    if (bookedSeats.includes(seatId)) return "gray.300";
    return "gray.600";
  };

  const totalPeople = personCounts.adult + personCounts.teen + personCounts.senior + personCounts.special;

  const isButtonDisabled =
    selectedSeats.length === 0 || selectedSeats.length < totalPeople;

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/movie/${movieId}`);
        const data = await res.json();
        const baseURL = process.env.NEXT_PUBLIC_SPRING_SERVER_URL;
        setMovie({ ...data, poster: baseURL + data.poster });
      } catch (e) {
        console.error("영화 정보 로딩 실패", e);
      }
    };
    fetchMovie();
  }, [movieId]);

  useEffect(() => {
    const fetchSeats = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/api/booking/showtimes/${showtimeId}/seats`);
        const json = await res.json();
        setSeatData(json.data || []);
      } catch (e) {
        console.error("좌석 정보 로딩 실패", e);
        setSeatData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSeats();
  }, [showtimeId]);

  const handlePayment = () => {
    sessionStorage.setItem('canAccessSecret2', 'true');
    router.push(
      `/checkout?movieId=${movieId}` +
        `&region=${encodeURIComponent(region)}` +
        `&theater=${encodeURIComponent(theater)}` +
        `&date=${encodeURIComponent(date)}` +
        `&time=${encodeURIComponent(time)}` +
        `&seats=${selectedSeats.join(",")}` +
        `&adult=${personCounts.adult}` +
        `&teen=${personCounts.teen}` +
        `&senior=${personCounts.senior}` +
        `&special=${personCounts.special}`+
        `&showtimeId=${showtimeId}`
    );
  };

  const handleReset = () => {
        setSelectedSeats([]);
        // setPersonCounts({
        //     adult: 0,
        //     teen: 0,
        //     senior: 0,
        //     special: 0,
        // });
    };

  const [realaccess,setRealAccess]=useState(sessionStorage.getItem('canAccess2')==='true');
  const redirected = useRef(false);

  useEffect(()=>{
    if (!redirected.current) {
      document.title = "좌석선택 - FILMORA";
      (async () => {
        try {
          const allowed = sessionStorage.getItem('canAccess2');
          if (allowed !== 'true') {
            openModal("잘못된 접근입니다.", ()=>{router.push('/booking');}, ()=>{router.push('/booking');}); // 허용되지 않으면 예매 페이지로
          }
          sessionStorage.removeItem('canAccess2');
        } catch (e) {
          console.log(e);
        }
      })();
      redirected.current = true;
    }
  },[]);

  if(!realaccess){
    return (
    <>
      <Header headerColor="black" headerBg="white" userInfo={user} />
      {isModalOpen && (
        <Modal
        isModalOpen={isModalOpen}
        isModalVisible={isModalVisible}
        closeModal={closeModal}
        onConfirm={onConfirm}
        onCancel={onCancel}
        content={modalContent}
        isPaddingLarge={true}
        />
      )}
    </>
    );
  }

  return (<>
    <Box bg="#141414" color="white" minH="100vh" pb={12}>
      <Header headerColor="white" headerBg="#1a1a1a" userInfo={user} />

      <Box px={4} pt={6}>
        <Text fontSize="3xl" fontWeight="normal" textAlign="center">{movie?.title}</Text>

        <Flex mt={4} direction="row" align="flex-start" gap={4} wrap="nowrap">
          {movie?.poster && (
            <Image
              src={movie.poster}
              alt={movie.title}
              w="40%"
              minW="120px"
              borderRadius="lg"
            />
          )}
          <Box flex={1} minW="200px">
            <Text fontSize="2xl" mb={4}>예매 정보</Text>
            <Text fontSize="lg">지역: {region}</Text>
            <Text fontSize="lg">영화관: {theater}</Text>
            <Text fontSize="lg">날짜: {date}</Text>
            <Text fontSize="lg">시간: {time}</Text>
          </Box>
        </Flex>

        <Flex mt={6} gap={4} direction={{ base: "column", sm: "row" }} mb={20}>
          <Box flex={1}>
            {Object.entries({ adult: "성인", teen: "청소년", senior: "경로", special: "우대" }).map(([key, label]) => (
              <Flex key={key} align="center" justify="space-between" mb={1}>
                <Text fontSize="md">{label}</Text>
                <Flex align="center">
                  <Button 
                    size="xs" 
                    bg={clickedButton === key + "-" + "minus" ? "#6B46C1" : undefined}
                    onClick={() => {
                    setPersonCounts(prev => ({ ...prev, [key]: Math.max(0, prev[key] - 1) }));
                    setClickedButton(key + "-" + "minus");
                    setTimeout(() => setClickedButton(null), 200); // 200ms 후 원래색으로
                    setSelectedSeats([]);
                  }}
                  >
                    -
                    </Button>
                     <Text mx={2}>{personCounts[key]}</Text>
                    <Button
                    size="xs"
                    bg={clickedButton === key + "-" + "plus" ? "#6B46C1" : undefined}
                    onClick={() => {
                        if (totalPeople >= 8) {
                        openModal("최대 8매까지 예매가능합니다.");
                        return;
                        }
                        setPersonCounts(prev => ({ ...prev, [key]: prev[key] + 1 }));
                        setClickedButton(key + "-" + "plus");
                        setTimeout(() => setClickedButton(null), 200);
                        setSelectedSeats([]);
                    }}
                    >
                    +
                    </Button>
                </Flex>
              </Flex>
            ))}
            <Flex justifyContent='flex-end' pt='15px'>
              <Text fontSize="20px" fontWeight="normal" mb={2}>
                    최종결제금액 :
                  </Text>
              <Text fontSize="20px" fontWeight="normal" mb={2}>
                {personCounts.adult*15000 +
                personCounts.teen*12000 +
                personCounts.senior*10000 +
                personCounts.special*8000}원
              </Text>
            </Flex>
            <Text fontSize="xs" color="gray.400" mt={1} textAlign="right">
              ※ 최대 8매까지 예매가능
            </Text>
          </Box>
        </Flex>  
            <Box
                width="100%"
                height="30px"
                borderTop="3px solid #6B46C1"
                borderLeft="3px solid transparent"
                borderRight="3px solid transparent"
                borderRadius="120% / 100%"
                mx="auto"
                position="relative"
                mb={0}
            />
            <Text
                mt={-6}
                fontSize="xl"
                fontWeight="normal"
                letterSpacing="widest"
                color="gray.300"
                mb={10}
                textAlign="center"
            >
                SCREEN
            </Text>
        {loading ? (
          <Flex justify="center" align="center" h="200px">
            <Spinner size="lg" color="purple.500" />
          </Flex>
        ) : (
          <Box mt={6} overflowX="auto">
            <Grid
              templateColumns="repeat(3, 40px) 40px repeat(8, 40px) 40px repeat(2, 40px)"
              gapX="5px"
              gapY="20px"
              mx="auto"
              justifyContent="center"
              w="max-content"
            >
              {rowLabels.map((rowLabel) => (
                <React.Fragment key={rowLabel}>
                  <Box
                    fontSize="md"
                    w="40px"
                    h="40px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontWeight="normal"
                  >
                    {rowLabel}
                  </Box>
                  {Array.from({ length: cols + 2 }).map((_, colIndex) => {
                    if (colIndex === 2 || colIndex === 11) return <Box key={colIndex} />;

                    const seatNumber = colIndex + 1 + (colIndex > 2 ? -1 : 0) + (colIndex > 11 ? -1 : 0);
                    const seatId = `${rowLabel}${seatNumber}`;

                    return (
                      <Box
                        key={seatId}
                        w="40px"
                        h="40px"
                        bg={getSeatColor(seatId)}
                        _hover={{
                          bg:
                            !bookedSeats.includes(seatId) &&
                            !disabledSeats.includes(seatId) &&
                            !selectedSeats.includes(seatId)
                              ? "#6B46C1"
                              : undefined,
                          cursor: bookedSeats.includes(seatId)
                            ? "not-allowed"
                            : "pointer",
                        }}
                        borderRadius="md"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontSize="sm"
                        onClick={() => toggleSeat(seatId)}
                        border={selectedSeats.includes(seatId) ? "2px solid white" : "none"}
                      >
                        {seatNumber}
                      </Box>
                    );
                  })}
                </React.Fragment>
              ))}
            </Grid>
          </Box>
        )}
        <Flex justify="center" mt={8} gap={6} wrap="wrap">
                <Flex align="center">
                    <Box w="20px" h="20px" bg="gray.500" borderRadius="md" mr={2} />
                    <Text fontSize="md" color="gray.300">예약 가능</Text>
                </Flex>
                <Flex align="center">
                    <Box w="20px" h="20px" bg="gray.300" borderRadius="md" mr={2} />
                    <Text fontSize="md" color="gray.300">예약 완료</Text>
                </Flex>
                    <Flex align="center">
                    <Box w="20px" h="20px" bg="blue.500" borderRadius="md" mr={2} />
                <Text fontSize="md" color="gray.300">장애인석</Text>
                </Flex>
                    <Flex align="center">
                    <Box w="20px" h="20px" bg="#6B46C1" borderRadius="md" mr={2} border="2px solid white" />
                <Text fontSize="md" color="gray.300">선택한 좌석</Text>
                </Flex>
                <Button
                size="sm"
                fontSize="sm"
                color="white"
                _hover={{ bg: "#6B46C1" }}
                variant="outline"
                onClick={handleReset}
                mt={{ base: 4, md: 0 }}
                >
                초기화
                </Button>
            </Flex>

        <Box mt={6}>
            <Text fontSize="md">
                선택한 좌석: {
                    selectedSeats.length
                    ? [...selectedSeats].sort((a, b) => {
                        const rowA = a.charAt(0);
                        const rowB = b.charAt(0);
                        const numA = parseInt(a.slice(1));
                        const numB = parseInt(b.slice(1));
                        return rowA === rowB ? numA - numB : rowA.localeCompare(rowB);
                        }).join(", ")
                    : "없음"
                }
            </Text>

          <Button
            mt={4}
            bg={isButtonDisabled ? "gray.600" : "#6B46C1"}
            color="white"
            size="lg"
            w="full"
            isDisabled={isButtonDisabled}
            onClick={() => {
                if (!isButtonDisabled) {
                  handlePayment();
                  // alert(`결제 진행: 좌석 ${selectedSeats.join(", ")}`);
                }
            }}
          >
            결제하기
          </Button>
        </Box>
      </Box>
    </Box>
    {isModalOpen && (
        <Modal
        isModalOpen={isModalOpen}
        isModalVisible={isModalVisible}
        closeModal={closeModal}
        onConfirm={onConfirm}
        onCancel={onCancel}
        content={modalContent}
        isPaddingLarge={true}
        />
      )}
  </>);
}
