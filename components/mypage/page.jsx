import React from 'react';
import {Tabs} from "@chakra-ui/react"
import {FaFilm,FaQuestion} from 'react-icons/fa';
import {FiUser} from 'react-icons/fi';
import {Header,Footer} from '../../components';
import {fetch} from '../../lib/server';

export default async function Mypage(){
    
    let headerColor='black';
    let headerBg='#F9F9F9';
    let footerColor='black';
    let footerBg='#F9F9F9';
    let footerBorder='#ccc';

    const res=await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);

     return <>
     <Header headerColor={headerColor} headerBg={headerBg} userInfo={res}></Header>
    <Tabs.Root defaultValue="members" orientation='vertical'>
      <Tabs.List>
        <Tabs.Trigger value="booking">
            <FaFilm/>
          예매내역 확인
        </Tabs.Trigger>
        <Tabs.Trigger value="modify">
            <FiUser/>
          개인정보 수정
        </Tabs.Trigger>
        <Tabs.Trigger value="qna">
            <FaQuestion/>
          1:1 QnA
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="booking">
        예매내역 확인 페이지(미구현)
      </Tabs.Content>
      <Tabs.Content value="modify">
        

      </Tabs.Content>
      <Tabs.Content value="qna">
        1:1 QnA 페이지(미구현)
      </Tabs.Content>
    </Tabs.Root>
    <Footer footerColor={footerColor} footerBg={footerBg} footerBorder={footerBorder}></Footer>
  </>;
}