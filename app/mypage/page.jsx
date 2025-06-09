import React from 'react';

import {Header} from '../../components';
import Mypage from '../../components/mypage/page';
import Notloginalert from '../../components/mypage/notloginalert';
import {fetch} from '../../lib/server';

export const metadata={
    title: '마이페이지',
    description: '개인정보 수정, 예매내역 확인 등을 할 수 있는 페이지입니다.',
};

export default async function Mypagemain(){
    const res=await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);
    const qnares1=await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/author/${res?.username}`);
    const qnares2=await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/reply/${res?.username}`);

    return <>
        <Header userInfo={res}></Header>
        <Notloginalert userInfo={res}/>
        <Mypage userInfo={res} qnaInfo={qnares1} replyInfo={qnares2}/>
    </>
};