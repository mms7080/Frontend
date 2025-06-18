import React from "react";

import {fetch} from "../../lib/server"
import Store from '../../components/store/store';

export default async function StoreGeneralMain() {
  const res=await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);
  return <Store userData={res}/>;
}