import React from 'react';

import {Header} from '../../components';
import {fetch} from '../../lib/server';
import Theater from '../../components/theater/theater';

export const metadata = {
    title: '영화관 - FILMORA',
    description: '영화관 정보를 볼 수 있는 페이지입니다.'
};

export default async function TheaterPage() {

    const userRes = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);
    const regionRes = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/api/booking/regions`)
    const theaterRes = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/api/booking/theaters/all`)

    return <>
        <Header headerColor="white" headerBg="#1a1a1a" userInfo={userRes}/>
        <Theater userInfo={userRes} regionInfo={regionRes} theaterInfo={theaterRes}/>
    </>
}