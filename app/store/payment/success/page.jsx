import React from "react";

import {fetch} from "../../../../lib/server"
import Storepayment from '../../../../components/store/storepayment';

export const metadata = {
    title: '결제 - FILMORA',
    description: ''
};

export default async function StorePaymentMain() {
  const res=await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);
  return <Storepayment userData={res}/>;
}