import React from 'react';
import {Tabs,Box} from "@chakra-ui/react"
import {FaFilm,FaQuestion} from 'react-icons/fa';
import {FiUser} from 'react-icons/fi';
import {Header} from '../../components';
import {fetch} from '../../lib/server';
import {Modify} from '.';

//import {Bookingcheck,Qna} from '.';

export default async function Mypage(){
    const res=await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);

     return <>
     <Header userInfo={res}></Header>
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
          src="http://localhost:9999/images/logo.png"
          alt="logo"
          style={{ width: "141px", height: "68px", objectFit: "contain" }}
        />
        </h1>

        <Tabs.Root key='outline' defaultValue="booking" variant='outline' fitted>
          <Tabs.List>
              <Tabs.Trigger value="booking">
                  예매/구매내역
              </Tabs.Trigger>
              <Tabs.Trigger value="modify">
                  개인정보 수정
              </Tabs.Trigger>
              <Tabs.Trigger value="qna">
                  1:1 QnA
              </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="booking">
            예매/구매내역 확인 페이지(미구현)
          </Tabs.Content>
          <Tabs.Content value="modify">
            <Modify userInfo={res}></Modify>
          </Tabs.Content>
          <Tabs.Content value="qna">
            1:1 QnA 페이지(미구현)
          </Tabs.Content>
        </Tabs.Root>
    </Box>
  </>;
}