import React from 'react';

import Search from '../../../components/search/page'
import {fetch} from '../../../lib/server';

export const metadata = {
    title: '검색',
    description: '영화, 이벤트, 리뷰를 검색할 수 있는 사이트입니다.',
};

export default async function Searchpage({params}){
    const userres=await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);
    const movieres=await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/movie`);
    const eventres=await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/event`);
    const reviewinfo = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/review/all`);
    return <Search userData={userres} movieData={movieres} serverEvents={eventres} reviewInfo={reviewinfo} keywordData={decodeURIComponent(params.keyword)}/>;
}