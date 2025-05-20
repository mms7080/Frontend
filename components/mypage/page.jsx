import React from 'react';
import {Tabs,Box} from "@chakra-ui/react"
import {FaFilm,FaQuestion} from 'react-icons/fa';
import {FiUser} from 'react-icons/fi';
import {Header,Footer} from '../../components';
import {fetch} from '../../lib/server';
import {Modify} from '.';
//import {Bookingcheck,Qna} from '.';

export default async function Mypage(){
    
    let headerColor='black';
    let headerBg='#F9F9F9';
    let footerColor='black';
    let footerBg='#F9F9F9';
    let footerBorder='#ccc';

    const res=await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);

     return <>
     <Header headerColor={headerColor} headerBg={headerBg} userInfo={res}></Header>
     
    <Tabs.Root w='100%' defaultValue="modify" orientation='vertical'>
      {/* 왼쪽 탭 리스트 */}
      <Box w="15%" minW="250px" ml='250px' pt='50px'>
        <Tabs.List>
          <Tabs.Trigger value="booking" fontSize='16px'>
            <FaFilm/>
            예매내역 확인
          </Tabs.Trigger>
          <Tabs.Trigger value="modify" fontSize='16px'>
            <FiUser/>
            개인정보 수정
          </Tabs.Trigger>
          <Tabs.Trigger value="qna" fontSize='16px'>
            <FaQuestion/>
            1:1 QnA
          </Tabs.Trigger>
        </Tabs.List>
      </Box>
    {/* 오른쪽 콘텐츠 */}
      <Box w='85%' pl="40px">
        <Tabs.Content value="booking">
          예매내역 확인 페이지(미구현)
        </Tabs.Content>
        <Tabs.Content value="modify">
          <Modify userInfo={res}></Modify>
        </Tabs.Content>
        <Tabs.Content value="qna">
          1:1 QnA 페이지(미구현)
        </Tabs.Content>
      </Box>
    </Tabs.Root>
    <Footer footerColor={footerColor} footerBg={footerBg} footerBorder={footerBorder}></Footer>
  </>;
}