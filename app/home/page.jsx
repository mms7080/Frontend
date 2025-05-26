import React from 'react';
import {Flex,Box} from '@chakra-ui/react';

import {Swipers,Movies,Bookmark,Events,Reviews} from '../../components/home';
import {Header,Footer} from '../../components';

import {fetch} from '../../lib/server';

export const metadata = {
    title: '필모라 - 영화 예매 사이트',
    description: '필모라는 최신 영화를 예매하고 리뷰할 수 있는 사이트입니다.',
};

export default async function Homepage(){

    let headerColor='white';
    let headerBg='#1a1a1a';
    let footerColor='white';
    let footerBg='#1a1a1a';
    let footerBorder='transparent';

    const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);

    return <>
        <Header headerColor={headerColor} headerBg={headerBg} userInfo={res}></Header>
        <Box w='calc(100vw - 17px)' minW='1000px'>
            <Flex w='100%' flexDirection='column'>
                <Swipers></Swipers>
                <Movies></Movies>
                <Bookmark></Bookmark>
                <Events></Events>
                <Reviews></Reviews>
            </Flex>
        </Box>
        <Footer footerColor={footerColor} footerBg={footerBg} footerBorder={footerBorder}></Footer>
        </>;
        // 종현 테스트
}