import React from 'react';
import {Tabs,Box} from "@chakra-ui/react"
import {FaFilm,FaQuestion} from 'react-icons/fa';
import {FiUser} from 'react-icons/fi';
import {Bookingcheck,Modify,Qna} from '.';

export default function Mypage({userInfo,qnaInfo,replyInfo,reservationInfo,paymentInfo}){

    reservationInfo=[...reservationInfo].filter((item)=>item.userId===userInfo?.username);
    paymentInfo=[...paymentInfo].filter((item)=>(item.userId===userInfo?.username&&item.orderName!=="Movie Ticket"&&item.orderName!=="영화 예매"));
    console.log(paymentInfo);
     return <>
     <Box maxW="1200px" mx="auto" pt={{ base: 10, md: 20 }} px={{ base: 4 }} pb={10}>
      <h1
          style={{
            fontSize: "24px",
            fontWeight: "normal",
            color: "#222",
            borderBottom: "2px solid #ccc",
            paddingBottom: "12px",
            marginBottom: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px"
          }}
        >
        <img
          src={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/images/logo.png`}
          alt="logo"
          style={{ width: "141px", height: "68px", objectFit: "contain" }}
          loading='lazy'
        />
        </h1>

        <Tabs.Root key='outline' defaultValue="booking" variant='outline' fitted overflow='visible'>
          <Tabs.List>
              <Tabs.Trigger value="booking" fontSize={{base:11,md:16}}>
                 <FaFilm/> 예매/구매내역
              </Tabs.Trigger>
              <Tabs.Trigger value="modify" fontSize={{base:11,md:16}}>
                 <FiUser/> 개인정보 수정
              </Tabs.Trigger>
              <Tabs.Trigger value="qna" fontSize={{base:11,md:16}}>
                 <FaQuestion/> 1:1 QnA
              </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="booking">
            <Bookingcheck userInfo={userInfo} reservationInfo={reservationInfo} paymentInfo={paymentInfo}></Bookingcheck>
          </Tabs.Content>
          <Tabs.Content value="modify">
            <Modify userInfo={userInfo}></Modify>
          </Tabs.Content>
          <Tabs.Content value="qna" overflow='visible'>
            <Qna userInfo={userInfo} qnaInfo={qnaInfo} replyInfo={replyInfo}></Qna>
          </Tabs.Content>
        </Tabs.Root>
    </Box>
  </>;
}