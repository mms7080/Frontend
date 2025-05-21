import React from 'react';
import {Button,Flex,Input} from '@chakra-ui/react';

export default function Reviews({userInfo}){
    return <>
        <Flex flexDirection='column'>
            <span>어벤져스 : 엔드게임에 대한 2개의 이야기가 있어요!</span>
            <Flex justifyContent='space-between'>
                <span>전체 2건</span>
                <span>최신순|공감순|평점순</span>
            </Flex>
            <form>
                <Flex w='100%'>
                    <span>{userInfo?userInfo.username:''}</span>
                    <Input flex='1'/>
                    <Button bg='#352461'>관람평쓰기</Button>
                </Flex>
            </form>
        </Flex>
    </>;
}