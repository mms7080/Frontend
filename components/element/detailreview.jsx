import React from 'react';

import {Flex,Text,Box,Button,Input} from '@chakra-ui/react';

export default function Detailreview({author,score,content}){
    return <>
        <Flex w='100%' gap='15px'>
            <Flex w='120px' h='70px' justifyContent='center' alignItems='center' mr='5px'>{author.substring(0,2)+'**'+author.substring(4)}</Flex>
            <Flex w='100%' h='70px' flex='1' bg='#F8F8FA' borderRadius='5px' alignItems='center'>
                <Flex w='100%' gap='15px' alignItems='center'>
                    <span style={{color:'#352461',paddingLeft:20,width:100}}>관람평</span>
                    <span style={{color:'#352461',fontSize:40,width:50}}>{score}</span>
                    <Box bg='#DFDFE1' w='1px' h='50px'></Box>
                    <Text pl='20px' flex='1' color='#666691'>{content}</Text>
                    <form action={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/reviewlike/logic`} method='post'>
                        <Flex flexDirection='column' alignItems='center'>
                            <Button type='submit' bg='#F8F8FA' h='30px' fontSize='16px'>👍</Button>
                            <Input ml='7px' w='5px'h='13px' fontSize='13px' border='none' outline='none' value={0} readOnly color='#666691'/>
                        </Flex>
                    </form>
                </Flex>
            </Flex>
        </Flex>
    </>
}