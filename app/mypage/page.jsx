import React from 'react';

import Mypage from '../../components/mypage/page';
import Notloginalert from '../../components/mypage/notloginalert';
import {fetch} from '../../lib/server';

export const metadata={
    title: '마이페이지 - FILMORA',
    description: '개인정보 수정, 예매내역 확인 등을 할 수 있는 페이지입니다.',
};

export default async function Mypagemain(){
    const res=await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);
    let qnares1=[],qnares2=[],reservationres=[],paymentres=[];

    if(res?.auth!=='ADMIN'){
        qnares1=await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/qna/author/${res?.username}`);
        qnares2=await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/qna/reply/${res?.username}`);
    }else{
        qnares1=await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/qna/all`);
        qnares2=[];
    }

    reservationres=await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/reservations`);
    paymentres=await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/payments`);

    if(!res) return <Notloginalert userInfo={res}/>;
    return <>
        <Notloginalert userInfo={res}/>
        <Mypage userInfo={res} qnaInfo={qnares1} replyInfo={qnares2} reservationInfo={reservationres} paymentInfo={paymentres}/>
    </>
};