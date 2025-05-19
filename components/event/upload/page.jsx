'use client';

import { useState, useEffect } from 'react';
import { Box, Input, Button, VStack, Text, Heading, Image, Flex } from '@chakra-ui/react';
import { Header, Footer } from '../../';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function EventUploader() {
  const [form, setForm] = useState({
    title: '',
    category: '',
    images: [],
  });

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setUser(data);
      } catch {
        console.log('로그인 정보 없음');
      }
    })();
  }, []);

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
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  const handleSubmit = async () => {
    const { title, category, images } = form;

    if (!title || !startDate || !endDate || !category || images.length === 0) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    const formattedDate = `${formatDate(startDate)} ~ ${formatDate(endDate)}`;

    const data = new FormData();
    data.append('title', title);
    data.append('date', formattedDate);
    data.append('category', category);
    images.forEach(({ file }) => data.append('images', file));

    const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/event/upload`, {
      method: 'POST',
      body: data,
    });

    if (res.ok) {
      alert('이벤트 업로드 성공!');
      router.push('/event');
    } else {
      const error = await res.text();
      alert('업로드 실패: ' + error);
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

        <VStack spacing={5}>
          {/* 제목 */}
          <Box w="100%">
            <Text fontWeight="bold" mb={1}>제목</Text>
            <Input
              name="title"
              value={form.title}
              placeholder="제목"
              onChange={handleChange}
            />
          </Box>

          {/* 날짜 선택기 */}
          <Box w="100%">
            <Text fontWeight="bold" mb={1}>기간 선택</Text>
            <Flex gap={3} alignItems="center">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText="시작일"
                dateFormat="yyyy.MM.dd"
                className="chakra-input css-1c6xsvs"
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
                className="chakra-input css-1c6xsvs"
              />
            </Flex>
          </Box>

          {/* 카테고리 */}
          <Box w="100%">
            <Text fontWeight="bold" mb={1}>카테고리</Text>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', borderRadius: '6px' }}
            >
              <option value="">카테고리 선택</option>
              <option value="추천">추천</option>
              <option value="메가Pick">메가Pick</option>
              <option value="영화">영화</option>
              <option value="극장">극장</option>
              <option value="제휴/할인">제휴/할인</option>
              <option value="시사회/무대인사">시사회/무대인사</option>
            </select>
          </Box>

          {/* 이미지 업로드 */}
          <Box w="100%">
            <Text fontWeight="bold" mb={1}>이미지 업로드</Text>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
            />
            {/* 썸네일 미리보기 */}
            {form.images.length > 0 && (
              <Flex mt={3} gap={3} wrap="wrap">
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
                    />
                  </Box>
                ))}
              </Flex>
            )}
          </Box>

          <Button w="100%" colorScheme="purple" onClick={handleSubmit}>
            이벤트 등록
          </Button>
        </VStack>
      </Box>

      <Box h="100px" />
      <Footer footerColor="black" footerBg="white" footerBorder="#ddd" />
    </>
  );
}
