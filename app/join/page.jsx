import React from 'react';

import {Header,Footer} from '../../components';
import {fetch} from '../../lib/server';
import Join from '../../components/join/join';

export const metadata = {
    title: '회원가입',
    description: '회원가입을 할 수 있는 페이지입니다.'
};

export default async function Joinpage(){

    const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);
    
    let headerColor='black';
    let headerBg='#F9F9F9';
    let footerColor='black';
    let footerBg='#F9F9F9';
    let footerBorder='#ccc';

    return <>
        <Header headerColor={headerColor} headerBg={headerBg} userInfo={res}></Header>
        <Join></Join>
        <Footer footerColor={footerColor} footerBg={footerBg} footerBorder={footerBorder}></Footer>
        </>;
}