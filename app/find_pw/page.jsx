import React from 'react';

import Findpw from '../../components/findidandpw/findpw';

export const metadata = {
    title: '비밀번호 재설정 - FILMORA',
    description: '비밀번호 재설정을 위한 페이지입니다.',
};

export default async function Find_pw(){
    return <Findpw/>;
}