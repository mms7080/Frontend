import React from 'react';
import {VStack,Image} from '@chakra-ui/react';

export default function Event({src,content}){
    return <VStack w='240px' borderRadius='8px' bg='white' textAlign='center' overflow='hidden' boxShadow='0 2px 10px rgba(0,0,0,0.1)'>
            <Image w='100%' src={src} alt="이벤트" loading='lazy'/>
            <span style={{fontSize:14,color:'#333',paddingLeft:20,paddingRight:20,paddingTop:5,paddingBottom:10}}>{content}</span>
        </VStack>;
}