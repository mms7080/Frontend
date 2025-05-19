'use client';

import react from 'react';
import {useRouter} from 'next/navigation';
import {useState,useEffect} from 'react';
import fetch from './fetch.jsx';

export default function withLogin(Component){/* 로그인 되어있나 여부를 확인함 */
    const router = useRouter();
    const [userInfo,setUserInfo]=useState(null);

    
        useEffect(() => {
            (async ()=>{
                try {
                    const res=await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);
                    console.log(1);
                    console.log(res);
                    setUserInfo(res);
                    console.log(2);
                } catch (e) {}
            })();
        },[]);
        

    console.log(userInfo);

    if(userInfo===null){/* 로딩 시 null 반환 */
        return null;
    }

    if (!userInfo.username) {/* 미 로그인 시 로그인 페이지로 리디렉션 */
      router.push('/signin');
      return null;
    }

    return <Component/>;

}