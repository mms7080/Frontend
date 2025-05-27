import React from 'react';
import {fetch} from '../../../lib/server';
import Noticenew from '../../../components/notice/noticenew';

export default async function NoticeCreatePage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);
  return <>
    <Noticenew userData={res}/>
  </>;
}