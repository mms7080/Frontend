import React from 'react';
import {Button,Flex,Textarea,NativeSelect} from '@chakra-ui/react';
import Detailreview from '../element/detailreview'

export default function Reviews({userInfo}){
    return <>
        <Flex flexDirection='column'>
            <span style={{color:'#352461',fontSize:25}}>어벤져스: 엔드게임에 대한 <span style={{color:'#01738B'}}>2</span>개의 이야기가 있어요!</span>
            <Flex justifyContent='space-between' pt='50px' pb='15px'>
                <span>전체 <span style={{color:'#01738B'}}>2</span>건</span>
                <Flex w='150px' justifyContent='space-between'>
                    <span>최신순</span>
                    <span>|</span>
                    <span>공감순</span>
                    <span>|</span>
                    <span>평점순</span>
                </Flex>
            </Flex>
            
            
            <Flex flexDirection='column' gap='15px'>
                <Flex w='100%' gap='15px'>
                    <Flex w='120px' h='70px' justifyContent='center' alignItems='center' mr='5px'>{userInfo?userInfo.username:'로그인 필요'}</Flex>
                    <form action={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/review/logic`} method='post' style={{flex:1}}>
                        <Flex h='70px' border='1px solid #666666' borderRadius='5px' alignItems='center'>
                            <Textarea border='none' outline='none' 
                                maxLength='150'
                                /* 1) 리사이즈 자체를 막아 사선무늬 제거 */
                                resize="none"
                                /* 스크롤 자체를 숨김 */
                                overflow="hidden"
                                /* 또는 개별 축 숨김 */
                                overflowX="hidden"
                                overflowY="hidden"
                                /* CSS 커스터마이징으로 모든 브라우저에서 스크롤바 숨기기 */
                                sx={{
                                /* 공통 overflow 숨기기 */
                                overflow: "hidden",
                                /* Chrome, Safari, Edge Chromium */
                                "::-webkit-scrollbar": {
                                    width: "0px",
                                    height: "0px",
                                },
                                /* Firefox */
                                scrollbarWidth: "none",
                                /* IE 10+ */
                                msOverflowStyle: "none",
                                }}
                            id='review' name='review' h='70px' fontSize='16px' placeholder='어벤져스: 엔드게임 재미있게 보셨나요? 영화의 어떤 점이 좋았는지 이야기해주세요.'/>
                            <NativeSelect.Root width="100px">
                                <NativeSelect.Field name='score' defaultValue='10'>
                                    <option value={10}>10</option>
                                    <option value={9}>9</option>
                                    <option value={8}>8</option>
                                    <option value={7}>7</option>
                                    <option value={6}>6</option>
                                    <option value={5}>5</option>
                                    <option value={4}>4</option>
                                    <option value={3}>3</option>
                                    <option value={2}>2</option>
                                    <option value={1}>1</option>
                                </NativeSelect.Field>
                                <NativeSelect.Indicator/>
                            </NativeSelect.Root>
                            <Button type='submit' bg='white' color='#666666' h='60px' fontSize='16px'>✏️ 관람평쓰기</Button>
                        </Flex>
                    </form>
                </Flex>
                <Detailreview author='sicksicksicksick' score='10' content='이 영화 정말 최고였어요! 감동받았습니다.'></Detailreview>
                <Detailreview author='kjmm033' score='8' content='어벤져스 엔드게임 다시 봐도 소름...'></Detailreview>
            </Flex>
            
        </Flex>
    </>;
}