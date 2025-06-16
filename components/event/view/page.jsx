"use client";

import React, { useEffect, useState } from "react";
import Spinner from '../../Spinner';
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Text,
  Heading,
  // Spinner,
  Button,
  Flex,
  useBreakpointValue,
  Image,
} from "@chakra-ui/react";
import { Header } from "../..";
import Modal, { useModal } from '../../movie/modal';

export default function EventDetailPage({ userData }) {
  const { id } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [allEvents, setAllEvents] = useState([]);
  const [user, setUser] = useState(userData);
  const [loading, setLoading] = useState(true);
  const { isModalOpen, isModalVisible, openModal, closeModal, modalContent, onConfirm, onCancel, isConfirm } = useModal();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/event/raw`,
          { credentials: "include" }
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

      <Box
        maxW="1200px"
        mx="auto"
        pt={{ base: 10, md: 20 }}
        px={{ base: 4 }}
        pb={10}
      >
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "normal",
            color: "#222",
            borderBottom: "2px solid #ccc",
            paddingBottom: "12px",
            marginBottom: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
          }}
        >
          <img
            src="http://localhost:9999/images/logo.png"
            alt="logo"
            style={{ width: "141px", height: "68px", objectFit: "contain" }}
            loading="lazy"
          />
        </h1>
      </Box>

      <Box maxW="1000px" w="100%" mx="auto" mt={10} px={{ base: 4, md: 6 }}>
        {loading ? (
          <Flex justify="center" align="center" minH="300px">
            <Spinner size="xl" color="purple.500" />
          </Flex>
        ) : event ? (
          <>
            <Heading
              mb={2}
              fontSize={["2xl", "3xl"]}
              fontWeight="normal"
              color="gray.700"
            >
              🎉 {event.title}
            </Heading>
            <Text
              fontSize="sm"
              color="gray.500"
              mb={6}
              borderBottom="1px solid #eee"
              pb={2}
            >
              {event.date}
            </Text>

            <Box h={{ base: 12, md: 20 }} />

            {/* 이미지들 */}
            <Flex gap={4} wrap="wrap" mb={8} justify="center">
              {event.images?.map((img, idx) => (
                <Box
                  key={idx}
                  flex="1 1 48%"
                  minW="150px"
                  maxW="70%"
                  transition="all 0.3s"
                  _hover={{ transform: "scale(1.02)" }}
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}${img}`}
                    alt={`event-image-${idx}`}
                    w="100%"
                    h="auto"
                    objectFit="cover"
                    loading="lazy"
                  />
                </Box>
              ))}
            </Flex>

            <Box
              mt={10}
              borderTop="1px solid #ddd"
              borderBottom="1px solid #ddd"
              fontSize="13px"
              color="gray.700"
            >
              {/* 이전글 */}
              <Flex
                py={3}
                px={2}
                borderBottom="1px solid #eee"
                align="center"
                gap={2}
              >
                <Text w="80px" fontWeight="bold">
                  이전글
                </Text>
                {prev ? (
                  <Text
                    as="button"
                    textAlign="left"
                    onClick={() => router.push(`/event/view/${prev.id}`)}
                    _hover={{
                      textDecoration: "underline",
                      color: "purple.600",
                    }}
                  >
                    {prev.title}
                  </Text>
                ) : (
                  <Text color="gray.400">이전 게시글이 없습니다.</Text>
                )}
              </Flex>

              {/* 다음글 */}
              <Flex py={3} px={2} align="center" gap={2}>
                <Text w="80px" fontWeight="bold">
                  다음글
                </Text>
                {next ? (
                  <Text
                    as="button"
                    textAlign="left"
                    onClick={() => router.push(`/event/view/${next.id}`)}
                    _hover={{
                      textDecoration: "underline",
                      color: "purple.600",
                    }}
                  >
                    {next.title}
                  </Text>
                ) : (
                  <Text color="gray.400">다음 게시글이 없습니다.</Text>
                )}
              </Flex>
            </Box>

            {/* 목록으로 버튼만 유지 */}
            <Flex justify="center" mt={6}>
              <Button
                onClick={() => router.push("/event")}
                colorScheme="purple"
                w={["100%", "auto"]}
                fontWeight="normal"
                _hover={{ transform: "scale(1.05)" }}
              >
                목록으로
              </Button>
            </Flex>

            {/* 삭제 버튼 (ADMIN) */}
            {user?.auth === "ADMIN" && (
              <Flex justify="flex-end" mt={6}>
                <Button
                  onClick={async () => {
                    openModal("정말로 삭제하시겠습니까?",
                      async () => {
                        const res = await fetch(
                          `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/event/${event.id}`,
                          {
                            method: "DELETE",
                            credentials: "include",
                          }
                        );
                        if (res.ok) {
                          openModal("이벤트가 삭제되었습니다.", () => { router.push("/event"); }, () => { router.push("/event"); });
                        } else {
                          openModal("삭제에 실패했습니다.");
                        }
                      }, ()=>{}, true
                    )
                  }}
                  variant="outline"
                  colorScheme="red"
                  fontWeight="normal"
                >
                  삭제
                </Button>
                <Box h={{ base: 12, md: 20 }} />
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
      {isModalOpen && (<Modal
        isModalOpen={isModalOpen}
        isModalVisible={isModalVisible}
        closeModal={closeModal}
        onConfirm={onConfirm}
        onCancel={onCancel}
        isConfirm={isConfirm}
        content={modalContent} />)}
    </>
  );
}
