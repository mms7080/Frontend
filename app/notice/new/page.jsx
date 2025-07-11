import React from 'react';
import {fetch} from '../../../lib/server';
import Noticenew from '../../../components/notice/noticenew';

export const metadata = {
    title: '공지사항 작성 - FILMORA',
    description: '공지사항을 작성할 수 있는 페이지입니다.'
};

export default async function NoticeCreateMainPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);
  return <Noticenew userData={res}/>;
}