import React from 'react';

import {Image} from '@chakra-ui/react';

export default function Filmstill({movieinfo}){
    return <>
        { movieinfo.stillCut.map((src,index) =>
        <Image px={{base:15,md:0}} key={index} py='40px' loading='lazy' w='100%' src={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}${src}`}/>)
        }
    </>;
}