import React from 'react';

import {Box,VStack,Text,Button} from '@chakra-ui/react';
import Link from "next/link";
import {Header} from '../../../components';
import {fetch} from '../../../lib/server';

export const metadata = {
    title: "이용약관 - FILMORA",
    description: "영화 예매 사이트 이용약관"
};

export default async function Terms(){
    const userres = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);/* 로그인 중인 유저 정보 fetch */
    const agreementres = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/agreement`);

    return <>
        <Header userInfo={userres} />
        <Box w='100vw' minW='1000px'>
            <VStack w='100%'>
                <Box w='900px' px='30px' m='40px' bg='white'>
                    <Text pt='50px' whiteSpace="pre-line">{agreementres[0]}</Text>
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