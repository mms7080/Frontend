"use client";

import React, { useState } from 'react';
import { Box, Heading, Text, Image, SimpleGrid, Flex, Badge, Button } from '@chakra-ui/react';
import { Header, Footer } from '../../components';

const productData = [
  {
    category: '메가티켓',
    items: [
      { title: '일반관람권', price: '13,000원', badge: 'NEW', img: 'https://image.istarbucks.co.kr/upload/store/skuimg/2021/08/[9200000002407]_20210810110923499.jpg' },
      { title: 'Dolby Cinema 관람권', price: '18,000원', badge: '-2%', img: 'https://cdn.megabox.co.kr/static/pc/images/common/ico/ico-movie-symbol-dolby.png' },
      { title: '더 부티크 관람권', price: '15,000원', img: 'https://cdn.megabox.co.kr/static/pc/images/common/ico/ico-theater-boutique.png' },
      { title: '더 부티크 suite 관람권', price: '40,000원', badge: '-2%', img: 'https://cdn.megabox.co.kr/static/pc/images/common/ico/ico-theater-suite.png' },
    ],
  },
  {
    category: '팝콘/음료/콤보',
    items: [
      { title: '더블콤보', price: '13,900원', badge: 'BEST', img: 'https://cdn.megabox.co.kr/static/pc/images/store/img-combo-double.png' },
      { title: '리필콤보', price: '10,900원', badge: 'BEST', img: 'https://cdn.megabox.co.kr/static/pc/images/store/img-combo-refill.png' },
    ],
  },
  {
    category: '포인트몰',
    items: [
      { title: '일반관람권 2D 관람권', price: '9,900 Point', img: 'https://cdn-icons-png.flaticon.com/512/2910/2910791.png' },
      { title: 'Dolby Atmos 관람권', price: '10,900 Point', img: 'https://cdn-icons-png.flaticon.com/512/3595/3595455.png' },
      { title: '영화 4천원 할인쿠폰', price: '2,000 Point', badge: '쿠폰', img: 'https://cdn-icons-png.flaticon.com/512/992/992700.png' },
      { title: '영화 3천원 할인쿠폰', price: '1,500 Point', badge: '쿠폰', img: 'https://cdn-icons-png.flaticon.com/512/992/992703.png' },
    ],
  },
];

export default function MegaboxStorePage() {
  const [activeCategory, setActiveCategory] = useState(productData[0].category);
  const selected = productData.find((p) => p.category === activeCategory);

  return (
    <>
      <Header headerColor="black" headerBg="#f5f5f5" />
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
          {productData.map((cat) => (
            <Button
              key={cat.category}
              onClick={() => setActiveCategory(cat.category)}
              style={{
                backgroundColor: cat.category === activeCategory ? '#6B46C1' : '#eee',
                color: cat.category === activeCategory ? 'white' : '#333',
                padding: '8px 16px',
                borderRadius: '6px',
                fontWeight: 'bold',
                fontSize: '14px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {cat.category}
            </Button>
          ))}
        </Flex>

        <SimpleGrid columns={[1, 2, 4]} spacing={6}>
          {selected?.items.map((item, idx) => (
            <Box key={idx} borderWidth="1px" borderRadius="lg" overflow="hidden" bg="white">
              <Image src={item.img} alt={item.title} objectFit="cover" w="100%" h="200px" />
              <Box p={4}>
                <Flex justifyContent="space-between" alignItems="center" mb={2}>
                  <Text fontWeight="bold">{item.title}</Text>
                  {item.badge && <span style={{ backgroundColor: '#6B46C1', color: 'white', borderRadius: '4px', padding: '2px 6px', fontSize: '12px' }}>{item.badge}</span>}
                </Flex>
                <Text fontSize="sm" color="gray.600">{item.price}</Text>
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
