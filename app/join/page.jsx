import React from 'react';

import Join from '../../components/join/join';

export const metadata = {
    title: '회원가입 - FILMORA',
    description: '회원가입을 할 수 있는 페이지입니다.'
};

export default async function Joinpage(){
    return <Join></Join>;
}