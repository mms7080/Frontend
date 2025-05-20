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

const defaultCategories = ["전체", "티켓", "팝콘/음료/콤보", "포인트몰"];

export default function MegaboxStorePage() {
  const [storeData, setStoreData] = useState({});
  const [activeCategory, setActiveCategory] = useState(defaultCategories[0]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
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
      <Box maxW="1200px" mx="auto" pt={20} px={4} pb={10}>
        <Heading
          mb={10}
          fontSize="2xl"
          fontWeight="bold"
          textAlign="center"
          color="#222"
          borderBottom="2px solid #ccc"
          pb={3}
        >
          🛍️ 스토어
        </Heading>

        <Flex gap={3} mb={8} flexWrap="wrap" justify="center">
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

        {categoryList.map((category) => (
          <Box key={category} mb={12}>
            {activeCategory === "전체" && (
              <Text
                fontSize="xl"
                fontWeight="bold"
                mb={4}
                borderLeft="4px solid #6B46C1"
                pl={2}
              >
                {category}
              </Text>
            )}

            <SimpleGrid columns={4} spacing={10} justifyItems="center">
              {(storeData[category] || []).map((item) => (
                <Box
                  key={item.id}
                  w="280px"
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
                    >
                      <Text fontWeight="bold">{item.title}</Text>
                      {item.badge && (
                        <span
                          style={{
                            backgroundColor: item.badgeColor || "#6B46C1",
                            color: "white",
                            borderRadius: "4px",
                            padding: "2px 6px",
                            fontSize: "12px",
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Flex>
                    <Text fontSize="13px" color="#666" mb={1}>
                      {item.subtitle}
                    </Text>
                    <Flex alignItems="baseline" gap={2} mb={2}>
                      {item.originalPrice && (
                        <Text
                          fontSize="13px"
                          color="#aaa"
                          textDecoration="line-through"
                        >
                          {item.originalPrice}
                        </Text>
                      )}
                      <Text fontSize="16px" fontWeight="bold" color="#6B46C1">
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
      <div style={{ height: "230px" }} />
      <Footer footerBg="white" footerColor="black" />
    </>
  );
}
