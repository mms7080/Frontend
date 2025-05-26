import React from 'react';

import {fetch} from '.';
import {redirect} from 'next/navigation';

export default async function withLogin(Component){/* 로그인 되어있나 여부를 확인함 */
    
    const res=await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);

    if (!res) {/* 미 로그인 시 로그인 페이지로 리디렉션 */
      redirect('/signin');
      return null;
    }

    return <Component/>;
}