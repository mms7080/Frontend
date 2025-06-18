import React from 'react';

import {fetch} from '../../../lib/server';
import Storebuy from '../../../components/store/storebuy';

export const metadata = {
    title: '스토어 - FILMORA',
    description: ''
};

export default async function StoreBuyMain(){
    const res=await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);
    return <Storebuy userData={res}/>;
}