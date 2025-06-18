import React from "react";

import {fetch} from "../../../../lib/server"
import Storedetail from '../../../../components/store/storedetail';
import {Footer} from '../../../../components';

export default async function StoreDetailMain() {
  const res=await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);
  return <>
  <Storedetail userData={res}/>
  <Footer/>
  </>;
}