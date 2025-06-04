'use client';

import React,{useState} from 'react';
import {Box,Flex,VStack,Tabs} from '@chakra-ui/react';
import {Reviews,Filmstill} from '.';

export default function Bottombox({res,movieinfo,reviewinfo}){

    const [version, setVersion] = useState(0);

    return <VStack>
            <Box w='1200px' px='30px' borderRadius='10px' bg='white'>
                <Flex w='1140px' flexDirection='column' gap='30px' pt='40px' pb='80px'>
                    <Tabs.Root key='outline' defaultValue="trailer" variant='outline' fitted onValueChange={()=>{setVersion(version+1)}}>
                        <Tabs.List>
                            <Tabs.Trigger value="trailer">
                                스틸컷
                            </Tabs.Trigger>
                            <Tabs.Trigger value="review">
                                실관람평
                            </Tabs.Trigger>
                        </Tabs.List>
                        <Tabs.Content value="trailer">
                            <Filmstill movieinfo={movieinfo}></Filmstill>
                        </Tabs.Content>
                        <Tabs.Content value="review">
                            <Reviews key={version} userInfo={res} movieInfo={movieinfo} reviewInfo={reviewinfo}></Reviews>
                        </Tabs.Content>
                    </Tabs.Root>
                </Flex>
            </Box>
    </VStack>;
}