import React from "react";
import {fetch} from "../../../../lib/server";
import NoticeEditID from '../../../../components/notice/noticeeditid';

export default async function NoticeEditPage() {

  const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);
  return <NoticeEditID userData={res}/>;
}