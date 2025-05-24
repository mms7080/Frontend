"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Heading,
  Image,
  Button,
  Spacer,
} from "@chakra-ui/react";
import { Header, Footer } from "../../../../components";
import { useParams, useRouter } from "next/navigation";

export default function StoreDetailPage() {
  const [user, setUser] = useState(null);
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`, {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then(setUser);

    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/store/detail/${id}`, {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then(setProduct);
  }, [id]);

  if (!product) return <div>Loading...</div>;

  const unitPrice = parseInt(product.price.replace(/[^0-9]/g, ""));
  const totalPrice = (unitPrice * quantity).toLocaleString();

  return (
    <>
      <Header headerColor="black" headerBg="white" userInfo={user} />
      <Box maxW="1100px" mx="auto" pt={12} px={{ base: 4, md: 6 }} pb={20}>
        <Text fontSize="14px" color="gray.500" mb={4}>
          스토어 &gt; <b>스토어상세</b>
        </Text>

        <Heading fontSize={{ base: "xl", md: "2xl" }} mb={1} color="black">
          {product.title}
        </Heading>
        <Text fontSize={{ base: "sm", md: "md" }} mb={8} color="gray.600">
          {product.subtitle}
        </Text>

        <Flex
          direction={{ base: "column", md: "row" }}
          gap={10}
          align="flex-start"
        >
          <Box
            flexShrink={0}
            borderRadius="lg"
            overflow="hidden"
            border="1px solid #ddd"
            p={2}
            mx="auto"
          >
            <Image
              src={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}${product.imgUrl}`}
              alt={product.title}
              w={{ base: "100%", md: "300px" }}
              maxW="100%"
              h="auto"
              objectFit="contain"
            />
          </Box>

          <Box flex="1">
            <Text fontSize="sm" color="purple.600" fontWeight="bold" mb={2}>
              ⚠️ 일부 특별관(부티크, 돌비 등) 및 쿠폰 사용불가 극장에서는 사용이
              제한됩니다.
            </Text>
            <Text fontSize="sm" mb={5}>
              <b>유효기간:</b> 구매일로부터 1년 / 교환권 등록 후 10일 이내 사용
            </Text>

            <Box my={4} borderBottom="1px solid #e0e0e0" />

            <Flex
              direction={{ base: "column", sm: "row" }}
              align="center"
              gap={4}
              mb={4}
            >
              <Text fontWeight="bold" fontSize="md">
                수량선택
              </Text>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value >= 1) setQuantity(value);
                }}
                style={{
                  width: "80px",
                  padding: "6px 8px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                }}
              />
            </Flex>

            <Flex
              direction={{ base: "column", sm: "row" }}
              align={{ base: "stretch", sm: "center" }}
              gap={4}
              wrap="wrap"
            >
              <Button
                variant="outline"
                w={{ base: "100%", sm: "100px" }}
                borderColor="gray.300"
              >
                🎁 선물
              </Button>
              <Spacer display={{ base: "none", sm: "block" }} />
              <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                {totalPrice}원
              </Text>
              <Button
                w={{ base: "100%", sm: "120px" }}
                fontWeight="bold"
                bg="#6B46C1"
                color="white"
                _hover={{ bg: "#5A38A6" }}
                onClick={() => {
                  router.push(`/store/buy?id=${product.id}&qty=${quantity}`);
                }}
              >
                구매
              </Button>
            </Flex>
          </Box>
        </Flex>

        <Box mt={14}>
          <Text fontWeight="bold" fontSize="lg" mb={2} color="black">
            구매 후 유의사항
          </Text>
          <Box fontSize="14px" color="gray.700" whiteSpace="pre-line" mb={6}>
            - 상품은 구매일로부터 10일 이내 취소 가능 <br />
            - 구매일로부터 5년까지 유효기간 연장이 가능합니다. <br />
            - 최초 유효기간 만료 후에는 결제금액의 90%에 대해 환불 요청
            가능하며, 환불 처리에 7일 이상의 시간이 소요될 수 있습니다. (접수처
            : 1544-0070) <br />
            - 쿠폰으로 등록 시 유효기간 내 사용 필수 <br />
            - 일부 극장에서는 사용 제한 가능 <br />- 구매 취소 및 환불 요청은
            미사용 상품에 한해 가능하며, 사용한 상품에 대해서는 불가합니다.
          </Box>

          <Text fontWeight="bold" fontSize="lg" mb={2} color="black">
            상세 이용안내
          </Text>
          <Box fontSize="14px" color="gray.700" whiteSpace="pre-line">
            - 본 상품은 지정된 좌석에 한해 사용 가능합니다.
            <br />- 특별관(부티크, 돌비, 스위트 등) 사용불가일 수 있습니다.
          </Box>
        </Box>

        <Flex mt={10} gap={4}>
          <Button
            onClick={() => router.push("/store")}
            fontSize="sm"
            colorScheme="gray"
            variant="outline"
            w="fit-content"
          >
            ← 목록으로 돌아가기
          </Button>

          {user?.auth === "ADMIN" && (
            <Button
              fontSize="sm"
              fontWeight="bold"
              bg="#e53e3e"
              color="white"
              _hover={{ bg: "#c53030" }}
              w="fit-content"
              onClick={async () => {
                const confirmDelete = confirm("정말 삭제하시겠습니까?");
                if (!confirmDelete) return;

                try {
                  const res = await fetch(
                    `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/store/${product.id}`,
                    {
                      method: "DELETE",
                      credentials: "include",
                    }
                  );
                  if (!res.ok) throw new Error("삭제 실패");
                  alert("삭제가 완료되었습니다!");
                  router.push("/store");
                } catch (e) {
                  alert("삭제 중 오류 발생: " + e.message);
                }
              }}
            >
              삭제
            </Button>
          )}
        </Flex>
      </Box>

      <Footer footerBg="white" footerColor="black" />
    </>
  );
}
