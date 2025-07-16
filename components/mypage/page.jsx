import React from 'react';
import {Tabs,Box,Flex,Text} from "@chakra-ui/react"
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
            borderBottom: "2px solid #ccc",
            paddingBottom: "12px",
            marginBottom: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            textAlign:'center'
          }}
        >
        
        <Flex flexDirection='column' justifyContent='center'>
          <Text
            color='black'
            fontSize={{ base: 20, md: 24 }}
            fontWeight="bold"
            letterSpacing={3}
          >
            FILMORA
          </Text>
          <Text color="#ccc" fontSize="10px" letterSpacing="2">
            MEET PLAY SHARE
          </Text>
        </Flex>
        
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