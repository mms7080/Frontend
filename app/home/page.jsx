import React from 'react';
import {Flex,Box} from '@chakra-ui/react';

import {Swipers,Movies,Bookmark,Events,Reviews} from '../../components/home';
import {Header} from '../../components';

import {fetch} from '../../lib/server';

export const metadata = {
    title: '필모라 - 영화 예매 사이트',
    description: '필모라는 최신 영화를 예매하고 리뷰할 수 있는 사이트입니다.',
};

export default async function Homepage(){
    
    const userres = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);/* 로그인 중인 유저 정보 fetch */
    const movieres = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/movie`);/* 영화 fetch */
    const eventres = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/event`);/* 이벤트 fetch */
    const reviewinfo = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/review/all`);/* 리뷰 fetch */
    const entiremovieinfo=await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/movie/all`);;

    return <>
        <Header userInfo={userres} />
        <Box w='100vw' minW={{base:'0px',md:'1000px'}}>
            <Flex w='100%' flexDirection='column'>
                <Swipers></Swipers>
                <Movies userInfo={userres} movieInfo={movieres}></Movies>
                <Bookmark></Bookmark>
                <Events Fetchedevents={eventres}></Events>
                <Reviews reviewInfo={reviewinfo} entiremovieinfo={entiremovieinfo}></Reviews>
            </Flex>
        </Box>
        </>;
}