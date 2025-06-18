import React from 'react';

import {Header} from '../../components';
import {fetch} from '../../lib/server';
import Movie from '../../components/movie/movie'

export const metadata = {
    title: '영화 - FILMORA',
    description: ''
};

export default async function Moviepage(){
    
    const userRes = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);

    return <div className="bg-[#141414]">
        <Header userInfo={userRes}/>
        <Movie userInfo={userRes}/>
    </div>;
}