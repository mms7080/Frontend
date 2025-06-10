import React from 'react';
import {redirect} from 'next/navigation';
import {fetch} from '../../lib/server';
import Signinmain from '../../components/signin/signinmain';

export const metadata = {
    title: "로그인 - FILMORA",
    description: "영화 예매 사이트 로그인 페이지"
};

export default async function Signin(){
    const res=await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);

    if(res)/* 로그인 한 채로 로그인 페이지로 이동하면 홈으로 자동 리다이렉트*/
        redirect('/home');

    return <Signinmain></Signinmain>;
}