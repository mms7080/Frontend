import React from 'react';

import Admin from "../../components/admin/admin";
import {fetch} from "../../lib/server";

export default async function adminpage(){

  const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);

  return <>
    <Admin data={res}></Admin>
  </>;
}