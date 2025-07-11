import React from "react";

import {fetch} from "../../../../lib/server"
import Storedetail from '../../../../components/store/storedetail';

export const metadata = {
    title: '스토어 - FILMORA',
    description: '상품에 대한 상세정보를 볼 수 있는 페이지입니다.'
};

export default async function StoreDetailMain() {
  const res=await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);
  return <Storedetail userData={res}/>;
}