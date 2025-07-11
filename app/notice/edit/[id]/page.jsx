import React from "react";
import {fetch} from "../../../../lib/server";
import NoticeEditID from '../../../../components/notice/noticeeditid';

export const metadata = {
    title: '공지사항 수정 - FILMORA',
    description: '공지사항을 수정할 수 있는 페이지입니다.'
};


export default async function NoticeEditPage() {

  const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);
  return <NoticeEditID userData={res}/>;
}