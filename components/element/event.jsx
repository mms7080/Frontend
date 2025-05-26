import React from 'react';

import {VStack,Image,Text} from '@chakra-ui/react';
import Link from "next/link";

export default function Event({src,content,url}){
    return <Link href={url}>
            <VStack w='240px' borderRadius='8px' bg='white' textAlign='center' overflow='hidden' boxShadow='0 2px 10px rgba(0,0,0,0.1)' transition='all 0.2s ease'
                _hover={{transform:'translateY(-5px)',boxShadow:'0 4px 20px rgba(0, 0, 0, 0.4)'}}>
                <Image w='100%' src={src} alt="이벤트" loading='lazy'/>
                <Text w='100%' fontSize='14px' color='#333' px='20px' pt='5px' pb='10px' overflow='hidden' whiteSpace='nowrap' textOverflow='ellipsis'>{content}</Text>
            </VStack>
        </Link>;
}