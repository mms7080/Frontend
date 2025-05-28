import React from 'react';
import {Flex,Box,VStack,Input,Button,Image} from '@chakra-ui/react';
import Link from 'next/link';
import {Header} from '../../components';
import {redirect} from 'next/navigation';
import {fetch} from '../../lib/server';

export const metadata = {
    title: "로그인",
    description: "영화 예매 사이트 로그인 페이지"
};

export default async function Signin(){
    const res=await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);

    if(res)/* 로그인 한 채로 로그인 페이지로 이동하면 홈으로 자동 리다이렉트*/
        redirect('/home');

    return <>
        <Header></Header>
        <Box w='calc(100vw - 17px)' minW='1000px' h='540px'>
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
                                <Flex w='100%' justifyContent='flex-start' fontSize='15px' color='#555'>
                                    <span><input id="rl" type="checkbox" name="remember-login"/><label htmlFor='rl'>&nbsp;&nbsp;아이디 저장</label></span>
                                </Flex>
                                <Button type='submit' fontSize='17px' w='100%' bg='#6B46C1' _hover={{bg:'#553C9A'}} mt='10px'>로그인</Button>
                            </Flex>
                        </form>
                        <Flex w='100%' gap='10px' justifyContent='center'>
                            <Link href='/join'>
                                회원가입
                            </Link>
                            <span>|</span>
                            <Link href='/find_id'>
                                아이디 찾기
                            </Link>
                            <span>|</span>
                            <Link href='/find_pw'>
                                비밀번호 재설정
                            </Link>
                        </Flex>
                        <Flex w='100%' gap='50px' justifyContent='center'>
                            <Link href={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/oauth2/authorization/kakao`}>
                                <Image w='35px' h='35px' objectFit='cover' borderRadius='50%' src='https://cdn-icons-png.freepik.com/512/3669/3669973.png'/>
                            </Link>
                            <Link href={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/oauth2/authorization/naver`}>
                                <Image w='35px' h='35px' objectFit='cover' borderRadius='50%' src='https://w7.pngwing.com/pngs/344/368/png-transparent-naver-round-logo-search-engines-thumbnail.png'/>
                            </Link>
                            <Link href={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/oauth2/authorization/google`}>
                                <Image w='35px' h='35px' objectFit='cover' borderRadius='50%' src='https://upload.wikimedia.org/wikipedia/commons/0/09/IOS_Google_icon.png'/>
                            </Link>
                        </Flex>
                    </Flex>
                </VStack>
            </Flex>
        </Box>
        </>;
}