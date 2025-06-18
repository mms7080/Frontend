import React from 'react';

import {fetch} from '../../lib/server';
import Findpw from '../../components/findidandpw/findpw';
import {Footer} from '../../components';

export const metadata = {
    title: '비밀번호 재설정 - FILMORA',
    description: '비밀번호 재설정을 위한 페이지입니다.',
};

export default async function Find_pw(){
    const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`)

    return <>
    <Findpw userData={res}/>
    <Footer/>
    </>
    ;
}