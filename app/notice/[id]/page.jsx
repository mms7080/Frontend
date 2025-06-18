import React from 'react';
import {fetch} from "../../../lib/server";
import NoticeID from "../../../components/notice/noticeid";

export const metadata = {
    title: '공지사항 - FILMORA',
    description: ''
};

export default async function NoticeDetailPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);
  return <NoticeID userData={res}/>;
}