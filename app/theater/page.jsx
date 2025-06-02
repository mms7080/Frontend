import React from 'react';

import {Header,Footer} from '../../components';
import {fetch} from '../../lib/server';
import Theater from '../../components/theater/theater';

export const metadata = {
    title: '영화관 - 필모라',
    description: ''
};

export default async function TheaterPage() {

    const userRes = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);

    return <>
        <Header headerColor="white" headerBg="#1a1a1a" userInfo={userRes}/>
        <Theater userInfo={userRes}/>
    </>
}