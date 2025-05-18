import React from 'react';
import {Flex,Box,VStack,Input,Button} from '@chakra-ui/react';
import Link from 'next/link';
import {Header,Footer} from '../../components';

export const metadata = {
    title: "로그인",
    description: "영화 예매 사이트 로그인 페이지"
};

export default function Homepage(){

    let headerColor='black';
    let headerBg='#F9F9F9';
    let footerColor='black';
    let footerBg='#F9F9F9';
    let footerBorder='#ccc';

    return <>
        <Header headerColor={headerColor} headerBg={headerBg}></Header>
        <Box w='calc(100vw - 17px)' minW='1000px'>
            <Flex w='100%' flexDirection='column'>
                <VStack w='100%'>
                    <Flex w='400px' flexDirection='column' alignItems='center' gap='15px' py='50px'>
                        <span style={{fontSize:15,letterSpacing:1,alignSelf:'flex-start'}}>
                            <span style={{color:'#551A8B'}}><Link href="/home" style={{textDecoration:'underline'}}>홈</Link></span>
                            <span style={{color:'#555'}}>&gt;로그인</span>
                        </span>
                        <span style={{fontSize:28,marginBottom:10}}>로그인</span>
                        <form action={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/signin/logic`} method='post'>
                            <Flex w='400px' flexDirection='column' gap='15px'>
                                <Input id="id" name="id" placeholder='아이디' required/>
                                <Input id="pw" name="pw" type="password" placeholder='비밀번호' required/>
                                <Flex w='100%' justifyContent='space-between' fontSize='15px' color='#555'>
                                    <span><input id="rl" type="checkbox" name="remember-login"/><label htmlFor='rl'>&nbsp;&nbsp;아이디 저장</label></span>
                                    <span>아이디 찾기 / 비밀번호 재설정</span>
                                </Flex>
                                <Button type='submit' fontSize='17px' w='100%' bg='#2d2d2d' mt='30px'>로그인</Button>
                                <Link href={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/oauth2/authorization/kakao`}>
                                    <Button fontSize='17px' w='100%' bg='#FEE500' color='black'>카카오 로그인</Button>
                                </Link>
                                <Link href={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/oauth2/authorization/naver`}>
                                    <Button fontSize='17px' w='100%' bg='#03C75A'>네이버 로그인</Button>
                                </Link>
                                <Link href={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/oauth2/authorization/google`}>
                                    <Button fontSize='17px' w='100%' bg='#4285F4'>구글 로그인</Button>
                                </Link>
                            </Flex>
                        </form>
                        <span style={{color:'#555'}}>아직 회원이 아니신가요?</span>
                        <Button bg='#2d2d2d'>회원가입</Button>
                    </Flex>
                </VStack>
            </Flex>
        </Box>
        <Footer footerColor={footerColor} footerBg={footerBg} footerBorder={footerBorder}></Footer>
        </>;
}