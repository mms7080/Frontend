"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Image,
  SimpleGrid,
  Flex,
  Button,
} from "@chakra-ui/react";
import { Header, Footer } from "../../components";
import { useRouter } from "next/navigation";

const defaultCategories = ["전체", "티켓", "팝콘/음료/콤보", "포인트몰"];

export default function MegaboxStorePage() {
  const [storeData, setStoreData] = useState({});
  const [activeCategory, setActiveCategory] = useState(defaultCategories[0]);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        setUser(data);
      } catch {
        setUser(null);
      }
    })();

    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/store`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setStoreData(data);
      });
  }, []);

  const sortedKeys = [
    "티켓",
    "팝콘/음료/콤보",
    "포인트몰",
    ...Object.keys(storeData).filter(
      (k) => !["티켓", "팝콘/음료/콤보", "포인트몰"].includes(k)
    ),
  ];
  const categoryList =
    activeCategory === "전체" ? sortedKeys : [activeCategory];

  return (
    <>
      <Header headerColor="black" headerBg="#f5f5f5" userInfo={user} />
      <Box maxW="1200px" mx="auto" pt={{ base: 10, md: 20 }} px={{ base: 4 }} pb={10}>
        <Heading
          mb={10}
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="bold"
          textAlign="center"
          color="#222"
          borderBottom="2px solid #ccc"
          pb={3}
        >
          🛍️ 스토어
        </Heading>

        <Flex justify="space-between" align="center" wrap="wrap" mb={8} px={2}>
          <Flex gap={2} flexWrap="wrap">
            {defaultCategories.map((category) => (
              <Button
                key={category}
                onClick={() => setActiveCategory(category)}
                style={{
                  backgroundColor:
                    category === activeCategory ? "#6B46C1" : "#eee",
                  color: category === activeCategory ? "white" : "#333",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  fontWeight: "bold",
                  fontSize: "14px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {category}
              </Button>
            ))}
          </Flex>
          <Button
            colorScheme="purple"
            onClick={() => router.push("/store/upload")}
            mt={{ base: 4, md: 0 }}
          >
            + 스토어 등록
          </Button>
        </Flex>

        {categoryList.map((category) => (
          <Box key={category} mb={12}>
            {activeCategory === "전체" && (
              <Text
                fontSize={{ base: "lg", md: "xl" }}
                fontWeight="bold"
                mb={4}
                borderLeft="4px solid #6B46C1"
                pl={2}
              >
                {category}
              </Text>
            )}

            <SimpleGrid
              columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
              spacing={{ base: 6, md: 10 }}
              justifyItems="center"
            >
              {(storeData[category] || []).map((item) => (
                <Box
                  key={item.id}
                  w="100%"
                  maxW="280px"
                  borderWidth="1px"
                  borderRadius="lg"
                  bg="white"
                  p={5}
                  minH="360px"
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}${item.imgUrl}`}
                    alt={item.title}
                    objectFit="cover"
                    w="100%"
                    h="200px"
                    mb={3}
                    borderRadius="md"
                  />
                  <Box>
                    <Flex
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                      gap={2}
                    >
                      <Text fontWeight="bold" fontSize="15px" isTruncated>
                        {item.title}
                      </Text>
                      {item.badge && (
                        <span
                          style={{
                            backgroundColor: item.badgeColor || "#6B46C1",
                            color: "white",
                            borderRadius: "4px",
                            padding: "2px 6px",
                            fontSize: "12px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Flex>
                    <Text fontSize="13px" color="#666" mb={1} noOfLines={2}>
                      {item.subtitle}
                    </Text>

                    {/* 🔽 가격 강조 영역 전체 교체된 부분 */}
                    <Flex
                      alignItems="center"
                      gap={2}
                      mb={2}
                      flexWrap="wrap"
                      bg="#FAF5FF"
                      px={2}
                      py={1}
                      borderRadius="6px"
                    >
                      {item.originalPrice && (
                        <>
                          <Text
                            fontSize="13px"
                            color="#aaa"
                            textDecoration="line-through"
                            fontWeight="normal"
                          >
                            {item.originalPrice}
                          </Text>
                          <Text
                            fontSize="12px"
                            color="red"
                            fontWeight="semibold"
                            bg="#FED7D7"
                            px={2}
                            py={0.5}
                            borderRadius="4px"
                          >
                            할인중
                          </Text>
                        </>
                      )}
                      <Text
                        fontSize="18px"
                        fontWeight="bold"
                        color="#6B46C1"
                        letterSpacing="-0.5px"
                      >
                        {item.price}
                      </Text>
                    </Flex>

                    <Button
                      w="100%"
                      bg="#6B46C1"
                      color="white"
                      py={2}
                      fontWeight="bold"
                      borderRadius="6px"
                      fontSize="14px"
                      transition="all 0.3s"
                      _hover={{ bg: "#553C9A", transform: "scale(1.02)" }}
                      onClick={() => router.push(`/store/detail/${item.id}`)}
                    >
                      구매하기
                    </Button>
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        ))}
      </Box>
      <Box height={{ base: "100px", md: "230px" }} />
      <Footer footerBg="white" footerColor="black" />
    </>
  );
}
