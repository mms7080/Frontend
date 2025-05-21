'use client';

import React,{useState,useEffect} from 'react';
import {Box,Flex,VStack,Image,Button} from '@chakra-ui/react';
import {Header,Footer} from '../../components';
import {Tabs} from "@chakra-ui/react";
import {Reviews,Trailer} from '../../components/detail';

export default function detail(){
        let headerColor='black';
        let headerBg='#F9F9F9';
        let footerColor='black';
        let footerBg='#F9F9F9';
        let footerBorder='#ccc';

        const [user, setUser] = useState(null);
        
        useEffect(() => {
            document.title = '영화 상세 페이지';
    
            (async ()=>{
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);
                    setUser(res);
                } catch (e) {}
            })();
        }, []);
    
        return <>
            <Header headerColor={headerColor} headerBg={headerBg} userInfo={user}></Header>
            <Box>
                <Flex w='100vw' h='660px' position='relative' backgroundSize='cover' justifyContent='space-around' backgroundRepeat='no-repeat' backgroundImage="url('https://image-cdn.hypb.st/https%3A%2F%2Fkr.hypebeast.com%2Ffiles%2F2019%2F02%2Fmarvel-avengers-endgame-new-teaser-super-bowl-tw.jpg?w=1080&cbr=1&q=90&fit=max')">
                    <Box w='100%' h='100%' position='absolute' bg='rgba(0,0,0,0.6)'></Box>
                    <Flex justifyContent='center' alignItems='flex-start' flexDirection='column' gap='10px' color='white' position='relative' zIndex='1'>
                        <span style={{fontSize:40}}>어벤져스 : 엔드게임</span>
                        <span style={{fontSize:20}}>Avengers: Endgame</span>
                        <Flex gap='10px'>
                            <Button fontSize='16px'>🤍 7.7k</Button>
                            <Button fontSize='16px'>공유하기</Button>
                        </Flex>

                        <Flex gap='10px' color='black' fontSize='14px'>
                            <Box px='5px' borderRadius='5px' bg='white'>IMAX</Box>
                            <Box px='5px' borderRadius='5px' bg='white'>4DX</Box>
                        </Flex>

                        <Flex justifyContent='space-between' gap='10px'>
                            <Flex flexDirection='column'>
                                <span>실관람 평점</span>
                                <span style={{fontSize:20}}>🎬 9.6</span>
                            </Flex>
                            <Flex flexDirection='column'>
                                <span>예매율</span>
                                <span style={{fontSize:20}}>1위 (34.2%)</span>
                            </Flex>
                            <Flex flexDirection='column'>
                                <span>누적관객수</span>
                                <span style={{fontSize:20}}>👥 594,416명</span>
                            </Flex>
                        </Flex>
                    </Flex>

                    <VStack pt='80px'>
                        <Image w='280px' borderRadius='10px' src='https://upload.wikimedia.org/wikipedia/ko/thumb/f/f2/%EC%96%B4%EB%B2%A4%EC%A0%B8%EC%8A%A4-_%EC%97%94%EB%93%9C%EA%B2%8C%EC%9E%84_%ED%8F%AC%EC%8A%A4%ED%84%B0.jpg/1200px-%EC%96%B4%EB%B2%A4%EC%A0%B8%EC%8A%A4-_%EC%97%94%EB%93%9C%EA%B2%8C%EC%9E%84_%ED%8F%AC%EC%8A%A4%ED%84%B0.jpg'/>
                        <Button w='280px'>예매</Button>
                        <Button w='280px'>🎧 Dolby CINEMA</Button>
                    </VStack>
                </Flex>
                <VStack>
                    <Box w='900px' px='30px' m='40px' borderRadius='10px' bg='white' boxShadow='-5px 5px 5px rgba(0, 0, 0, 0.05), 5px 5px 5px rgba(0, 0, 0, 0.05)'>
                        <Flex w='840px' flexDirection='column' gap='30px' pt='40px' pb='80px'>
                            <span style={{textAlign:'center',fontSize:28}}><b>영화 소개</b></span>
                            <span>
                            마블 시네마틱 유니버스(MCU)의 피날레!<br/>
    어벤져스: 엔드게임은 지난 10년간 이어져온 마블 히어로들의 여정을 마무리하는 작품으로, 팬들의 감동과 기대를 한 몸에 받은 대작입니다.<br/><br/>

    인피니티 워에서 타노스의 손에 의해 우주의 절반이 사라지고, 살아남은 히어로들은 시간과 공간을 넘나드는 최후의 반격을 준비합니다.<br/><br/>

    팀워크, 희생, 그리고 진정한 영웅의 의미를 그린 이 작품은 팬들에게 깊은 여운을 남기며, 히어로 영화의 새로운 기준을 제시합니다.<br/><br/>
    <br/><br/><br/><br/><br/><br/><br/>
                                <Image src='https://i.namu.wiki/i/vFPYI_yGi_9pqUocLkpKYslKfBawVtk1IUdKA069QOcmZSHsTyVuU5P4CQ6CYGXDpDGZ0jTIDZr-ZnVIEU5Z3w.webp'/><br/><br/>
                                <Image src='https://i.ytimg.com/vi/ijUsSpRVhBU/maxresdefault.jpg'/>
                            </span>
                        </Flex>
                    </Box>
                </VStack>
                <VStack>
                    <Box w='900px' px='30px' borderRadius='10px' bg='white' boxShadow='-5px 5px 5px rgba(0, 0, 0, 0.05), 5px 5px 5px rgba(0, 0, 0, 0.05)'>
                        <Flex w='840px' flexDirection='column' gap='30px' pt='40px' pb='80px'>
                            <Tabs.Root key='outline' defaultValue="review" variant='outline' fitted>
                                <Tabs.List>
                                    <Tabs.Trigger value="review">
                                        실관람평
                                    </Tabs.Trigger>
                                    <Tabs.Trigger value="trailer">
                                        예고편/스틸컷
                                    </Tabs.Trigger>
                                </Tabs.List>
                                <Tabs.Content value="review">
                                    <Reviews userInfo={user}></Reviews>
                                </Tabs.Content>
                                <Tabs.Content value="trailer">
                                    <Trailer></Trailer>
                                </Tabs.Content>
                            </Tabs.Root>
                        </Flex>
                    </Box>
                </VStack>
            </Box>
            <Footer footerColor={footerColor} footerBg={footerBg} footerBorder={footerBorder}></Footer>
        </>;
}