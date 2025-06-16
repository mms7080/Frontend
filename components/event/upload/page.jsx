"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Input,
  Button,
  VStack,
  Text,
  Heading,
  Image,
  Flex,
} from "@chakra-ui/react";
import { Header } from "../../";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Modal, { useModal } from '../../movie/modal';

export default function EventUploader({userData}) {
  const [form, setForm] = useState({
    title: "",
    category: "",
    images: [],
  });

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [user, setUser] = useState(userData);
  const {isModalOpen, isModalVisible, openModal, closeModal, modalContent, onConfirm, onCancel} = useModal();
  const router = useRouter();

  try {
    if (!user) throw new Error();
    // 🔐 관리자 체크
    if (user.auth !== "ADMIN") {
      openModal("관리자만 접근 가능한 페이지입니다.", ()=>{router.push("/event");}, ()=>{router.push("/event");});
    }
  } catch {
    openModal("로그인이 필요합니다.", ()=>{router.push("/signin");}, ()=>{router.push("/signin");});
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setForm((prev) => ({ ...prev, images: previews }));
  };

  const formatDate = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  const handleSubmit = async () => {
    const { title, category, images } = form;

    if (!title || !startDate || !endDate || !category || images.length === 0) {
      openModal("모든 항목을 입력해주세요.");
      return;
    }

    const formattedDate = `${formatDate(startDate)} ~ ${formatDate(endDate)}`;

    const data = new FormData();
    data.append("title", title);
    data.append("date", formattedDate);
    data.append("category", category);
    images.forEach(({ file }) => data.append("images", file));

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/event/upload`,
      {
        method: "POST",
        body: data,
      }
    );

    if (res.ok) {
      openModal("이벤트 업로드 성공!", ()=>{router.push("/event");}, ()=>{router.push("/event");});
    } else {
      const error = await res.text();
      openModal("업로드 실패: " + error);
    }
  };

  return (
    <>
      <Header headerColor="black" headerBg="#f5f5f5" userInfo={user} />

      <Box
        maxW="700px"
        mx="auto"
        mt={16}
        p={8}
        border="1px solid #ccc"
        borderRadius="lg"
        boxShadow="lg"
        bg="white"
      >
        <Heading fontSize="2xl" mb={6} color="purple.600" textAlign="center">
          📤 이벤트 등록
        </Heading>

        <VStack spacing={8}>
          {" "}
          {/* spacing 값 증가 */}
          {/* 제목 */}
          <Box w="100%">
            <Text fontWeight="bold" mb={2}>
              제목
            </Text>{" "}
            {/* mb 증가 */}
            <Input
              name="title"
              value={form.title}
              placeholder="제목"
              onChange={handleChange}
            />
          </Box>
          {/* 날짜 선택기 */}
          <Box w="100%">
            <Text fontWeight="bold" mb={2}>
              기간 선택
            </Text>
            <Flex gap={4} alignItems="center">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText="시작일"
                dateFormat="yyyy.MM.dd"
                style={{
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  width: "140px",
                }}
              />
              <Text>~</Text>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                placeholderText="종료일"
                dateFormat="yyyy.MM.dd"
                style={{
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  width: "140px",
                }}
              />
            </Flex>
          </Box>
          {/* 카테고리 */}
          <Box w="100%">
            <Text fontWeight="bold" mb={2}>
              카테고리
            </Text>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                fontSize: "14px",
              }}
            >
              <option value="">카테고리 선택</option>
              <option value="Pick">Pick</option>
              <option value="영화">영화</option>
              <option value="극장">극장</option>
              <option value="제휴/할인">제휴/할인</option>
              <option value="시사회/무대인사">시사회/무대인사</option>
            </select>
          </Box>
          {/* 이미지 업로드 */}
          <Box w="100%">
            <Text fontWeight="bold" mb={2}>
              이미지 업로드
            </Text>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
            />
            {form.images.length > 0 && (
              <Flex mt={4} gap={4} wrap="wrap">
                {form.images.map((img, idx) => (
                  <Box
                    key={idx}
                    w="100px"
                    h="100px"
                    border="1px solid #ccc"
                    borderRadius="md"
                    overflow="hidden"
                  >
                    <Image
                      src={img.url}
                      alt={`preview-${idx}`}
                      w="100%"
                      h="100%"
                      objectFit="cover"
                      loading='lazy'
                    />
                  </Box>
                ))}
              </Flex>
            )}
          </Box>
          {/* 버튼 */}
          <Button w="100%" colorScheme="purple" mt={4} onClick={handleSubmit}>
            이벤트 등록
          </Button>
        </VStack>
      </Box>

      <Box h="100px" />
      {isModalOpen && (<Modal
      isModalOpen={isModalOpen}
      isModalVisible={isModalVisible}
      closeModal={closeModal}
      onConfirm={onConfirm}
      onCancel={onCancel}
      content={modalContent}/>)}
    </>
  );
}
