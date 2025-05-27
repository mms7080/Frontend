import React from 'react';
import NoticePage from '../../components/notice/NoticePage';
import {fetch} from '../../lib/server';

export default async function Page() {
  
  const userres = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userInfo`);
  const noticeres = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/notice`);

  return <>
    <NoticePage notices={noticeres} userData={userres} />
  </>;
}
