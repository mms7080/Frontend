import React from 'react';

import Search from '../../../components/search/page'
import {fetch} from '../../../lib/server';

export const metadata = {
    title: '영화 검색',
    description: '영화를 검색할 수 있는 사이트입니다.',
};

export default async function Searchpage({params}){
    const userres=await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);
    const movieres=await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/movie`);
    const eventres=await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/event`);
    return <Search userData={userres} movieData={movieres} serverEvents={eventres} keywordData={decodeURIComponent(params.keyword)}/>;
}