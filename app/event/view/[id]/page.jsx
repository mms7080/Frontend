
import React from "react";
import {fetch} from "../../../../lib/server";
import View from '../../../../components/event/view/page';

export default async function EventviewPage() {

  const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);
  return <>
    <View data={res}></View>
  </>;

}
