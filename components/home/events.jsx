'use client';

import React from 'react';
import {VStack,Grid} from '@chakra-ui/react';
import Event from '../element/event';

export default function Events({Fetchedevents}){
    return <VStack w='100%' bg='#f9f9f9' pt='80px' pb='50px'>
        <h1 style={{color:'black',fontSize:25,paddingBottom:15}}>진행 중인 이벤트</h1>
        <Grid templateColumns='repeat(3,240px)' gap='30px'>
            {(Fetchedevents["Pick"]).map((event,index) =>{
                if(index<3)
                    return <Event content={event.title} src={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}${event.image}`}></Event>;
            })}
        </Grid>
    </VStack>;
}