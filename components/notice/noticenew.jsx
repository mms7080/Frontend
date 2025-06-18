'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {Box,Flex,Text,Input,Textarea,Button} from '@chakra-ui/react';
import Modal, { useModal } from '../movie/modal';

import Header from '../header';

export default function NoticeCreatePage({userData}) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [writer, setWriter] = useState(userData?.name||'');
  const [content, setContent] = useState('');
  const [user, setUser] = useState(userData);
  const {isModalOpen, isModalVisible, openModal, closeModal, modalContent, onConfirm, onCancel} = useModal();

  useEffect(()=>{
  try {
    if (!user) throw new Error();

    // 🔐 관리자 외에는 접근 불가
    if (user.auth !== 'ADMIN') {
      openModal('관리자만 접근 가능한 페이지입니다.', ()=>{router.push('/notice');}, ()=>{router.push('/notice');});
    }
  } catch (e) {
    openModal('로그인이 필요합니다.', ()=>{router.push('/signin');}, ()=>{router.push('/signin');});
  }},[user]);

  const handleSubmit = async () => {
    if (!title || !writer || !content) {
      openModal('모든 항목을 입력해주세요.');
      return;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/notice/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ title, writer, content }),
    });

    if (res.ok) {
      openModal('공지사항이 등록되었습니다.', ()=>{router.push('/notice');}, ()=>{router.push('/notice');});
      
    } else {
      openModal('등록 실패');
    }
  };

  return (
    <>
      <Header headerColor="black" headerBg="#f5f5f5" userInfo={user} />

      <Box maxWidth='800px' my='40px' mx='auto' py='0' px='20px' fontFamily='Segoe UI, sans-serif'>
        <Text textAlign='center' fontSize='30px' mb='40px' borderBottom='2px solid #ccc' pb='10px'>📝 공지사항 작성</Text>

        <Flex flexDirection='column' gap='12px'>
          <Text fontSize='15px' mb='4px'>제목</Text>
          <Input
            placeholder="제목을 입력하세요"
            value={title}
            p='12px'
            fontSize='15px'
            border='1px solid #ccc'
            borderRadius='4px'
            outline='none'
            backgroundColor='#fcfcfc'
            fontWeight='normal'
            onChange={(e) => setTitle(e.target.value)}
          />

          <Text fontSize='15px' mb='4px'>작성자</Text>
          <Input
            value={writer}
            readOnly
            p='12px'
            fontSize='15px'
            border='1px solid #ccc'
            borderRadius='4px'
            outline='none'
            backgroundColor='#fcfcfc'
            fontWeight='normal'
            style={{ backgroundColor: '#eee', cursor: 'not-allowed' }}
          />

          <Text fontSize='15px' mb='4px'>내용</Text>
          <Textarea
            placeholder="공지사항 내용을 입력하세요"
            value={content}
            p='12px'
            fontSize='15px'
            border='1px solid #ccc'
            borderRadius='4px'
            outline='none'
            backgroundColor='#fcfcfc'
            fontWeight='normal'
            resize="vertical"
            onChange={(e) => setContent(e.target.value)}
            rows={10}
          />

          <Flex gap='10px' justifyContent='flex-end' mt='20px'>
            <Button 
            bg='#0070f3' color='white' py='10px' px='20px'
             border='none' borderRadius='4px' cursor='pointer' 
             transition='all 0.2s' fontWeight='normal'
             _hover={{bg:'#005bb5'}}
            onClick={handleSubmit}>등록하기</Button>
            <Button bg='#ccc' color='black' py='10px' px='20px' 
            border='none' borderRadius='4px' cursor='pointer' fontWeight='normal'
            _hover={{bg:'#bbb'}}
            onClick={() => router.push('/notice')}>취소</Button>
          </Flex>
        </Flex>
      </Box>
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
