import React from 'react';

import {Box,VStack,Text,Button} from '@chakra-ui/react';
import Link from "next/link";
import {Header} from '../../../components';
import {fetch} from '../../../lib/server';

export const metadata = {
    title: "개인정보처리방침 - FILMORA",
    description: "영화 예매 사이트 개인정보처리방침"
};

export default async function Personalinfo(){
    const userres = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);/* 로그인 중인 유저 정보 fetch */
    const agreementres = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/agreement`);

    return <>
        <Header userInfo={userres} />
        <Box w='100vw' minW={{base:'0px',md:'1000px'}}>
            <VStack w='100%'>
                <Box w={{base:'90%',md:'900px'}} px={{base:'0px',md:'30px'}} m={{base:'0px',md:'40px'}} bg='white'>
                    <Text pt='50px' whiteSpace="pre-line">{agreementres[1]}</Text>
                </Box>
                <Button mb='50px'>
                    <Link href='/home'>
                        홈으로 이동
                    </Link>
                </Button>
            </VStack>
        </Box>
    </>;
}