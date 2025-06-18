import React from 'react';

import {Header} from '../../components';
import {fetch} from '../../lib/server';
import Join from '../../components/join/join';

export const metadata = {
    title: '회원가입 - FILMORA',
    description: '회원가입을 할 수 있는 페이지입니다.'
};

export default async function Joinpage(){

    const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);
    return <>
        <Header userInfo={res}></Header>
        <Join></Join>
        </>;
}