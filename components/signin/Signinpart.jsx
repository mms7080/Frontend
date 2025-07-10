'use client';

import React,{useState,useEffect,useRef} from 'react';

import {useSearchParams,useRouter} from 'next/navigation';

import {Flex,Input,Button} from '@chakra-ui/react';

import Modal, { useModal } from '../movie/modal';

export default function SigninClientAlert({userInfo}) {
    const searchParams = useSearchParams();
    const hasRun = useRef(false);
    const hasLogin = useRef(false);
    const fail = searchParams.get("error");
    const router = useRouter();

    const [id, setId] = useState('');
    const [rememberId, setRememberId] = useState(false);
    const {isModalOpen, isModalVisible, openModal, closeModal, modalContent, onConfirm, onCancel} = useModal();

    // 페이지 처음 렌더링 시 remember-me-id 쿠키가 있다면 상태 반영
    useEffect(() => {
      const cookies = document.cookie.split(';').map(cookie => cookie.trim());
      const savedIdCookie = cookies.find(cookie => cookie.startsWith('remember-me-id='));
      if (savedIdCookie) {
        const savedId = decodeURIComponent(savedIdCookie.split('=')[1]);
        setId(savedId);
        setRememberId(true);
      }
      if(userInfo && !hasLogin.current){
        hasLogin.current=true;
        openModal("잘못된 접근입니다.", ()=>{router.push('/home');}, ()=>{router.push('/home');});
      }
    }, []);

    useEffect(() => {
      if (fail==='true' && !hasRun.current) {
        hasRun.current=true;
        openModal("로그인에 실패했습니다.\n아이디 또는 비밀번호를 확인해주세요.", ()=>{router.push('/signin');}, ()=>{router.push('/signin');});
      }
    }, [fail]);

    const handleSubmit = (e) => {
        if (rememberId) {
            // 저장
            document.cookie = `remember-me-id=${encodeURIComponent(id)}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7일
        } else {
            // 삭제
            document.cookie = 'remember-me-id=; path=/; max-age=0';
        }
    };

    if(userInfo){
      return <>
      {isModalOpen && (<Modal
        isModalOpen={isModalOpen}
        isModalVisible={isModalVisible}
        closeModal={closeModal}
        onConfirm={onConfirm}
        onCancel={onCancel}
        content={modalContent}
        isPaddingLarge={true}/>)}
        </>;
    }

    return <><form action={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/signin/logic`} method='post' onSubmit={handleSubmit}>
            <Flex w={{base:'330px',md:'400px'}} flexDirection='column' gap='15px'>
                <Input id="id" name="id" placeholder='아이디' value={id} onChange={(e) => setId(e.target.value)} required/>
                <Input id="pw" name="pw" type="password" placeholder='비밀번호' required/>
                <Flex w='100%' justifyContent='flex-start' fontSize='15px' color='#555'>
                    <span><input id="rl" type="checkbox" name="remember-login" checked={rememberId} onChange={(e) => setRememberId(e.target.checked)}/><label htmlFor='rl'>&nbsp;&nbsp;아이디 저장</label></span>
                </Flex>
                <Button type='submit' fontSize='17px' w='100%' bg='#6B46C1' _hover={{bg:'#553C9A'}} mt='10px'>로그인</Button>
            </Flex>
        </form>
        {isModalOpen && (<Modal
        isModalOpen={isModalOpen}
        isModalVisible={isModalVisible}
        closeModal={closeModal}
        onConfirm={onConfirm}
        onCancel={onCancel}
        content={modalContent}
        isPaddingLarge={true}/>)}
        </>
}