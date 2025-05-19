'use client';

import { useState, useEffect } from 'react';
import { Box, Input, Button, VStack, Text, Heading, Image, Flex } from '@chakra-ui/react';
import { Header, Footer } from '../../';
import { useRouter } from 'next/navigation';

export default function EventUploader() {
  const [form, setForm] = useState({
    title: '',
    date: '',
    category: '',
    images: [], // { file, url } 배열
  });

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

  const handleSubmit = async () => {
    const { title, date, category, images } = form;

    if (!title || !date || !category || images.length === 0) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    const data = new FormData();
    data.append('title', title);
    data.append('date', date);
    data.append('category', category);
    images.forEach(({ file }) => data.append('images', file)); // 실제 파일만 전송

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

      <Box maxW="700px" mx="auto" mt={16} p={8} border="1px solid #ccc" borderRadius="lg" boxShadow="lg" bg="white">
        <Heading fontSize="2xl" mb={6} color="purple.600" textAlign="center">
          📤 이벤트 등록
        </Heading>

        <VStack spacing={5}>
          <Box w="100%">
            <Text fontWeight="bold" mb={1}>제목</Text>
            <Input name="title" value={form.title} placeholder="제목" onChange={handleChange} />
          </Box>

          <Box w="100%">
            <Text fontWeight="bold" mb={1}>기간</Text>
            <Input name="date" value={form.date} placeholder="예: 2025.06.01 ~ 2025.06.30" onChange={handleChange} />
          </Box>

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

          <Box w="100%">
            <Text fontWeight="bold" mb={1}>이미지 업로드</Text>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
            />
            {/* ✅ 썸네일 미리보기 */}
            {form.images.length > 0 && (
              <Flex mt={3} gap={3} wrap="wrap">
                {form.images.map((img, idx) => (
                  <Box key={idx} w="100px" h="100px" border="1px solid #ccc" borderRadius="md" overflow="hidden">
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
