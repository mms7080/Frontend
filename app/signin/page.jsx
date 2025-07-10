import React from 'react';
import {fetch} from '../../lib/server';
import Signinmain from '../../components/signin/signinmain';

export const metadata = {
    title: "로그인 - FILMORA",
    description: "영화 예매 사이트 로그인 페이지"
};

export default async function Signin(){
    const res=await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);

    return <Signinmain userInfo={res}></Signinmain>;
}