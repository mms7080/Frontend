import React from "react";

import {fetch} from "../../../lib/server"
import Storeupload from '../../../components/store/storeupload';

export const metadata = {
    title: '스토어 업로드 - FILMORA',
    description: '스토어에 상품을 업로드 할 수 있는 페이지입니다.'
};

export default async function StoreUploadMain() {
  const res=await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);
  return <Storeupload userData={res}/>;
}