"use client";

import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, Image, SimpleGrid, Flex, Button } from '@chakra-ui/react';
import { Header, Footer } from '../../components';

const defaultCategories = ['메가티켓', '팝콘/음료/콤보', '포인트몰'];

export default function MegaboxStorePage() {
  const [storeData, setStoreData] = useState({});
  const [activeCategory, setActiveCategory] = useState(defaultCategories[0]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 유저 정보 가져오기 (로그인 유지용)
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setUser(data);
      } catch {
        setUser(null);
      }
    })();

    // 스토어 데이터 불러오기
    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/store`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        setStoreData(data);
        const firstCategory = defaultCategories.find(cat => data[cat]) || Object.keys(data)[0];
        setActiveCategory(firstCategory);
      });
  }, []);

  const selectedItems = storeData[activeCategory] || [];

  return (
    <>
      <Header headerColor="black" headerBg="#f5f5f5" userInfo={user} />
      <Box maxW="1200px" mx="auto" pt={20} px={4}>
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
                backgroundColor: category === activeCategory ? '#6B46C1' : '#eee',
                color: category === activeCategory ? 'white' : '#333',
                padding: '8px 16px',
                borderRadius: '6px',
                fontWeight: 'bold',
                fontSize: '14px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {category}
            </Button>
          ))}
        </Flex>

        <SimpleGrid columns={[1, 2, 4]} spacing={6}>
          {selectedItems.map((item) => (
            <Box key={item.id} borderWidth="1px" borderRadius="lg" overflow="hidden" bg="white">
              <Image src={item.imgUrl} alt={item.title} objectFit="cover" w="100%" h="200px" />
              <Box p={4}>
                <Flex justifyContent="space-between" alignItems="center" mb={2}>
                  <Text fontWeight="bold">{item.title}</Text>
                  {item.badge && <span style={{ backgroundColor: item.badgeColor || '#6B46C1', color: 'white', borderRadius: '4px', padding: '2px 6px', fontSize: '12px' }}>{item.badge}</span>}
                </Flex>
                <Text fontSize="13px" color="#666" mb={1}>{item.subtitle}</Text>
                <Flex alignItems="baseline" gap={2}>
                  {item.originalPrice && <Text fontSize="13px" color="#aaa" textDecoration="line-through">{item.originalPrice}</Text>}
                  <Text fontSize="16px" fontWeight="bold" color="#6B46C1">{item.price}</Text>
                </Flex>
                <Button
                  mt={3}
                  w="100%"
                  style={{
                    backgroundColor: '#6B46C1',
                    color: 'white',
                    padding: '10px 0',
                    fontWeight: 'bold',
                    borderRadius: '6px',
                    fontSize: '14px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  구매하기
                </Button>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
      <div style={{ height: "230px" }} />
      <Footer footerBg="white" footerColor="black" />
    </>
  );
}