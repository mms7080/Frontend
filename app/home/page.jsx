import React from 'react';
import dynamic from 'next/dynamic';
import {Flex,Box} from '@chakra-ui/react';

import {Swipers,Movies,Bookmark,Events,Reviews} from '../../components/home';
import SkeletonHeader from "../../components/SkeletonHeader";

import {fetch} from '../../lib/server';

export const metadata = {
    title: '필모라 - 영화 예매 사이트',
    description: '필모라는 최신 영화를 예매하고 리뷰할 수 있는 사이트입니다.',
};

export default async function Homepage(){

    // dynamic import: ssr: false 로 하면 서버에는 Skeleton만, 클라이언트가 로드되면 Header가 들어옴
    const Header = dynamic(
      () => import('../../components/header'),
      {
        ssr: true,
        loading: () => <SkeletonHeader bg="#1a1a1a" />,
      }
    );

    const userres = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);/* 로그인 중인 유저 정보 fetch */
    const movieres = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/movie`);/* 영화 fetch */
    const eventres = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/event`);/* 이벤트 fetch */
    const reviewinfo = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/review/all`);/* 리뷰 fetch */

    return <>
        {/* 서버→클라이언트 모두에서 SkeletonHeader 출력 → 클라이언트가 Header 로드 완료되면 교체 */}
        <Header userInfo={userres} />
        <Box w='100vw' minW='1000px'>
            <Flex w='100%' flexDirection='column'>
                <Swipers></Swipers>
                <Movies userInfo={userres} movieInfo={movieres}></Movies>
                <Bookmark></Bookmark>
                <Events Fetchedevents={eventres}></Events>
                <Reviews movieInfo={userres} reviewInfo={reviewinfo}></Reviews>
            </Flex>
        </Box>
        </>;
}