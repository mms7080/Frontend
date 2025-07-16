import React from 'react';
import {Flex,Box,VStack,Image,Text} from '@chakra-ui/react';
import Link from 'next/link';
import Signinparts from './signinparts';
import {Header} from '..';

export default function Signinmain(){

    return <>
        <Header/>
        <Box w='100vw' minW={{base:0,md:'1000px'}} h='540px'>
            <Flex w='100%' flexDirection='column'>
                <VStack w='100%'>
                    <Flex w={{base:'100%',md:'400px'}} flexDirection='column' alignItems='center' gap='15px' py='50px'>
                        <span style={{fontSize:15,letterSpacing:1,alignSelf:'flex-start'}}>
                            <Text color='#551A8B' display='inline' pl={{base:'25px',md:'0px'}}><Link href="/home" style={{textDecoration:'underline'}}>홈</Link></Text>
                            <span style={{color:'#555'}}>&gt;로그인</span>
                        </span>
                        <span style={{fontSize:28,marginBottom:10}}>로그인</span>
                        <Signinparts/>
                        <Flex w='100%' gap='10px' justifyContent='center'>
                            <Link href='/join'>
                                <Text _hover={{textDecoration:'underline'}}>
                                    회원가입
                                </Text>
                            </Link>
                            <span>|</span>
                            <Link href='/find_id'>
                                <Text _hover={{textDecoration:'underline'}}>
                                    아이디 찾기
                                </Text>
                            </Link>
                            <span>|</span>
                            <Link href='/find_pw'>
                                <Text _hover={{textDecoration:'underline'}}>
                                    비밀번호 재설정
                                </Text>
                            </Link>
                        </Flex>
                        <Flex w='100%' gap='50px' justifyContent='center'>
                            <Link href={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/oauth2/authorization/kakao`}>
                                <Flex w='40px' h='40px' justifyContent='center' alignItems='center'>
                                    <Image w='35px' h='35px' objectFit='cover' borderRadius='50%' src={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/images/signin1.png`}
                                    transition='all 0.3s ease-in-out'
                                    _hover={{transform:'rotate(-10deg) scale(1.1)',filter:'brightness(1.2)'}} loading='lazy'/>
                                </Flex>
                            </Link>
                            <Link href={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/oauth2/authorization/naver`}>
                                <Flex w='40px' h='40px' justifyContent='center' alignItems='center'>
                                    <Image w='35px' h='35px' objectFit='cover' borderRadius='50%' src={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/images/signin2.png`}
                                    transition='all 0.3s ease-in-out'
                                    _hover={{transform:'rotate(-10deg) scale(1.1)',filter:'brightness(1.2)'}} loading='lazy'/>
                                </Flex>
                            </Link>
                            <Link href={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/oauth2/authorization/google`}>
                                <Flex w='40px' h='40px' justifyContent='center' alignItems='center'>
                                    <Image w='35px' h='35px' objectFit='cover' borderRadius='50%' src={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/images/signin3.png`}
                                    transition='all 0.3s ease-in-out'
                                    _hover={{transform:'rotate(-10deg) scale(1.1)',filter:'brightness(1.2)'}} loading='lazy'/>
                                </Flex>
                            </Link>
                        </Flex>
                    </Flex>
                </VStack>
            </Flex>
        </Box>
        </>;
}