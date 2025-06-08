"use client";

import React,{ useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Text,
  Heading,
  Spinner,
  Button,
  Flex,
  useBreakpointValue,
  Image,
} from "@chakra-ui/react";
import { Header } from "../..";

export default function EventDetailPage({userData}) {
  const { id } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [allEvents, setAllEvents] = useState([]);
  const [user, setUser] = useState(userData);
  const [loading, setLoading] = useState(true);

  // 이벤트 데이터 불러오기
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/event/raw`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        setAllEvents(data);
        const found = data.find((e) => e.id === Number(id));
        setEvent(found);
      } catch {
        setEvent(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const currentIndex = allEvents.findIndex((e) => e.id === Number(id));
  const prev = currentIndex > 0 ? allEvents[currentIndex - 1] : null;
  const next =
    currentIndex < allEvents.length - 1 ? allEvents[currentIndex + 1] : null;

  const buttonDirection = useBreakpointValue({ base: "column", md: "row" });

  return (
    <>
      <Header headerColor="black" headerBg="white" userInfo={user} />

      <Box maxW="800px" mx="auto" mt={20} p={[4, 6]}>
        {loading ? (
          <Flex justify="center" align="center" minH="300px">
            <Spinner size="xl" color="purple.500" />
          </Flex>
        ) : event ? (
          <>
            <Heading mb={4} fontSize={["xl", "2xl"]}>
              {event.title}
            </Heading>
            <Text fontSize="sm" color="gray.500" mb={4}>
              {event.date}
            </Text>

            {/* ✅ 여러 이미지 보여주기 */}
            <Flex gap={4} wrap="wrap" mb={8}>
              {event.images?.map((img, idx) => (
                <Box
                  key={idx}
                  flex="1 1 45%"
                  minW="150px"
                  border="1px solid #eee"
                  borderRadius="md"
                  overflow="hidden"
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}${img}`}
                    alt={`event-image-${idx}`}
                    w="100%"
                    h="auto"
                    objectFit="cover"
                  />
                </Box>
              ))}
            </Flex>

            {/* 버튼 영역 */}
            <Flex
              direction={buttonDirection}
              justify="space-between"
              gap={3}
              mt={10}
              wrap="wrap"
            >
              <Button
                onClick={() => prev && router.push(`/event/view/${prev.id}`)}
                isDisabled={!prev}
                variant="outline"
                w={["100%", "auto"]}
                opacity={prev ? 1 : 0.5}
                cursor={prev ? "pointer" : "not-allowed"}
                _hover={prev ? {} : { bg: "none" }}
              >
                ← 이전글
              </Button>

              <Button
                onClick={() => router.push("/event")}
                colorScheme="purple"
                variant="solid"
                w={["100%", "auto"]}
              >
                목록으로
              </Button>

              <Button
                onClick={() => next && router.push(`/event/view/${next.id}`)}
                isDisabled={!next}
                variant="outline"
                w={["100%", "auto"]}
                opacity={next ? 1 : 0.5}
                cursor={next ? "pointer" : "not-allowed"}
                _hover={next ? {} : { bg: "none" }}
              >
                다음글 →
              </Button>
            </Flex>

            {/* 삭제 버튼 */}
            {user?.auth === "ADMIN" && (
              <Flex justify="flex-end" mt={4}>
                <Button
                  onClick={async () => {
                    const confirmed =
                      window.confirm("정말로 삭제하시겠습니까?");
                    if (!confirmed) return;

                    const res = await fetch(
                      `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/event/${event.id}`,
                      {
                        method: "DELETE",
                        credentials: "include",
                      }
                    );

                    if (res.ok) {
                      alert("이벤트가 삭제되었습니다.");
                      router.push("/event");
                    } else {
                      alert("삭제에 실패했습니다.");
                    }
                  }}
                  variant="outline"
                  colorScheme="red"
                  fontWeight="bold"
                >
                  삭제
                </Button>
              </Flex>
            )}
          </>
        ) : (
          <Flex justify="center" align="center" minH="200px">
            <Text fontSize="lg" color="red.500">
              이벤트 정보를 찾을 수 없습니다.
            </Text>
          </Flex>
        )}
      </Box>
    </>
  );
}
