'use client';

import React,{useState,useEffect} from 'react';
import {Box,Flex,VStack,Image,Button} from '@chakra-ui/react';
import {Header,Footer} from '../../components';
import {Tabs} from "@chakra-ui/react";
import {Reviews,Trailer} from '../../components/detail';

import {fetch} from '../../lib/client';

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
                        <span style={{fontSize:40}}>어벤져스: 엔드게임</span>
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
                        <Flex fontSize='18px'>
                            인피니티 워 이후 절반만 살아남은 지구의 마지막 희망이 된 어벤져스<br/>
                            사라진 이들을 되살리기위해 어벤져스의 모든 것을 걸었다!<br/>
                            살아남은 자들이 준비하는, 운명을 바꿀 최후의 전쟁이 펼쳐진다!
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
                            어벤져스: 엔드게임<br/><br/>
전 세계적인 찬사를 받은 '인피니티 사가'의 최종편. 이 극적인 마지막 결전에서 어벤져스는 우주 최강 악당 '타노스'와 대결한다. 끔찍한 사건으로 세계 인구의 절반이 사라지고 계급 간에 붕괴까지 일어난 상황, 남은 히어로들은 앞으로 나아가기 위해 고군분투하는데... 이들은 우주의 질서와 화합, 사랑하는 이들을 되찾기 위해 힘을 합쳐야 한다. 로버트 다우니 주니어, 크리스 에반스, 마크 러팔로, 크리스 헴스워스, 스칼렛 요한슨, 제레미 레너, 돈 치들, 폴 러드, 베네딕트 컴버배치, 채드윅 보즈먼, 브리 라슨, 톰 홀랜드, 카렌 길런, 조 샐다나, 에반젤린 릴리가 출연하는 마블 스튜디오의 '어벤져스: 엔드게임'은 케빈 파이기가 제작, 앤소니 루소와 조 루소가 감독을 맡았다. 루이스 데스포지토, 빅토리아 알론소, 마이클 그릴로, 트린 트란, 존 파브로, 제임스 건, 스탠 리가 제작 총괄을 맡았고 크리스토퍼 마커스와 스티븐 맥필리가 각본을 썼다. 일부 빛이 깜빡이는 장면이나 패턴은 광과민성 시청자들에게 영향을 미칠 수 있다.



일부 섬광 장면이 빛에 민감한 시청자에게 영향을 줄 수 있음.
                            </span>
                            <Flex w='100%'>
                                <Flex w='50%' flexDirection='column'>
                                    <span>러닝 타임:</span>
                                    <span style={{color:'#6D6D96'}}>3시간 5분</span>
                                    <span>공개일:</span>
                                    <span style={{color:'#6D6D96'}}>2019년 4월 24일</span>
                                    <span>장르:</span>
                                    <span style={{color:'#6D6D96'}}>슈퍼 히어로어드벤처, 액션SF판타지</span>
                                    <span>관람 등급:</span>
                                    <Flex bg='#E4B533' w='25px' h='25px' borderRadius='5px' justifyContent='center' alignItems='center' color='white' fontSize='18px'>12</Flex>
                                </Flex>
                                <Flex w='50%' flexDirection='column'>
                                    <span>감독:</span>
                                    <span style={{color:'#6D6D96'}}>안소니 루소조 루소</span>
                                    <span>출연:</span>
                                    <span style={{color:'#6D6D96'}}>로버트 다우니 주니어</span>
                                    <span style={{color:'#6D6D96'}}>크리스 에반스</span>
                                    <span style={{color:'#6D6D96'}}>마크 러팔로</span>
                                    <span style={{color:'#6D6D96'}}>크리스 헴스워스</span>
                                    <span style={{color:'#6D6D96'}}>스칼렛 요한슨</span>
                                    <span style={{color:'#6D6D96'}}>제레미 레너</span>
                                </Flex>
                                
                            </Flex>
                            <span></span>
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