import React from "react";

import {fetch} from "../../../lib/server"
import Storeupload from '../../../components/store/storeupload';

export default async function StoreUploadMain() {
  const res=await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);
  return <Storeupload userData={res}/>;
}