import React from 'react';

import {fetch} from '../../lib/server';
import Findid from '../../components/findidandpw/findid';

export const metadata = {
    title: '아이디 찾기 - FILMORA',
    description: '아이디 찾기를 위한 페이지입니다.',
};

export default async function Find_id(){
        
    const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);

    return <Findid userData={res}/>;
}