'use client';

import React,{useState,useEffect,useRef} from 'react';

import {useSearchParams,useRouter} from 'next/navigation';

import {Flex,Input,Button} from '@chakra-ui/react';

export default function SigninClientAlert() {
    const searchParams = useSearchParams();
    const hasRun = useRef(false);
    const fail = searchParams.get("error");
    const router = useRouter();

    const [id, setId] = useState('');
    const [rememberId, setRememberId] = useState(false);

    // 페이지 처음 렌더링 시 remember-me-id 쿠키가 있다면 상태 반영
    useEffect(() => {
      const cookies = document.cookie.split(';').map(cookie => cookie.trim());
      const savedIdCookie = cookies.find(cookie => cookie.startsWith('remember-me-id='));
      if (savedIdCookie) {
        const savedId = decodeURIComponent(savedIdCookie.split('=')[1]);
        setId(savedId);
        setRememberId(true);
      }
    }, []);

    useEffect(() => {
      if (fail==='true' && !hasRun.current) {
        alert("로그인에 실패했습니다.\n아이디 또는 비밀번호를 확인해주세요.");
        router.push('/signin');
        hasRun.current=true;
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

    return <form action={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/signin/logic`} method='post' onSubmit={handleSubmit}>
            <Flex w='400px' flexDirection='column' gap='15px'>
                <Input id="id" name="id" placeholder='아이디' value={id} onChange={(e) => setId(e.target.value)} required/>
                <Input id="pw" name="pw" type="password" placeholder='비밀번호' required/>
                <Flex w='100%' justifyContent='flex-start' fontSize='15px' color='#555'>
                    <span><input id="rl" type="checkbox" name="remember-login" checked={rememberId} onChange={(e) => setRememberId(e.target.checked)}/><label htmlFor='rl'>&nbsp;&nbsp;아이디 저장</label></span>
                </Flex>
                <Button type='submit' fontSize='17px' w='100%' bg='#6B46C1' _hover={{bg:'#553C9A'}} mt='10px'>로그인</Button>
            </Flex>
        </form>;
}