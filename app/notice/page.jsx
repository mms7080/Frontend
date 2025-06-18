import React from 'react';
import NoticePage from '../../components/notice/NoticePage';
import {fetch} from '../../lib/server';

export default async function noticemainPage() {
  
  const userres = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);
  const noticeres = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/notice`);

  return <NoticePage notices={noticeres} userData={userres}/>;
}
