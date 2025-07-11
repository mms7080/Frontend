import React from 'react';

import {fetch} from '../../../lib/server';
import Storebuy from '../../../components/store/storebuy';

export const metadata = {
    title: '스토어 - FILMORA',
    description: '상품을 구매할 수 있는 페이지입니다.'
};

export default async function StoreBuyMain(){
    const res=await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);
    return <Storebuy userData={res}/>;
}