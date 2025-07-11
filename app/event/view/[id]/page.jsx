
import React from "react";
import {fetch} from "../../../../lib/server";
import View from '../../../../components/event/view/page';

export const metadata = {
    title: '이벤트 - FILMORA',
    description: '이벤트를 열람할 수 있는 페이지입니다.'
};

export default async function EventviewPage() {

  const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);
  return <View userData={res}></View>;

}
